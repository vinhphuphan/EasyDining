using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.Order;
using server.Entities;
using server.Entities.OrderAggregate;
using server.Helpers;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController(AppDbContext context) : ControllerBase
{
    // GET /api/orders
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ServiceResult<PagedList<OrderDto>>>> GetOrders(
    [FromQuery] string? tableCode,
    [FromQuery] OrderStatus? status,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20
    )
    {
        var query = context.Orders.OrderByDescending(o => o.OrderDate).AsQueryable();

        if (!string.IsNullOrEmpty(tableCode))
            query = query.Where(o => o.TableCode == tableCode);

        if (status != null)
            query = query.Where(o => o.OrderStatus == status);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var totalCount = await query.CountAsync();
        var orders = await query
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectToDto()
            .ToListAsync();

        return Ok(ServiceResult<PagedList<OrderDto>>.Ok(
            new PagedList<OrderDto>(orders, totalCount, page, pageSize)
        ));
    }


    // GET /api/orders/{id}
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceResult<OrderDto>>> GetOrderById(int id)
    {
        var order = await context.Orders
            .Where(o => o.Id == id)
            .AsNoTracking()
            .ProjectToDto()
            .FirstOrDefaultAsync();

        if (order is null)
            return NotFound(ServiceResult<OrderDto>.Fail("Order not found"));

        return Ok(ServiceResult<OrderDto>.Ok(order));
    }

    [HttpPut("update-status")]
    [Authorize]
    public async Task<ActionResult> UpdateOrderStatus(UpdateOrderStatusDto dto)
    {
        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
        {
            var validStatuses = string.Join(", ", Enum.GetNames<OrderStatus>());
            return BadRequest(new
            {
                message = $"Invalid status '{dto.Status}'. Valid statuses: {validStatuses}"
            });
        }

        var order = await context.Orders.FindAsync(dto.OrderId);
        if (order is null)
            return NotFound(new { message = "Order not found" });

        order.OrderStatus = newStatus;
        await context.SaveChangesAsync();

        return Ok(new { message = $"Order status changed to {newStatus}" });
    }

    // POST /api/orders
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ServiceResult<OrderDto>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ServiceResult<OrderDto>.Fail("Invalid order data"));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(ServiceResult<OrderDto>.Fail("Order must contain at least one item."));

        // Normalize order type
        var normalizedOrderType = string.IsNullOrWhiteSpace(request.OrderType)
            ? "Dine In"
            : request.OrderType.Trim();

        Table? table = null;

        // Validate table for dine-in orders
        if (normalizedOrderType.Equals("Dine In", StringComparison.OrdinalIgnoreCase))
        {
            if (string.IsNullOrWhiteSpace(request.TableCode))
                return BadRequest(ServiceResult<OrderDto>.Fail("TableCode is required for Dine In orders"));

            // Look up the table by code
            table = await context.Tables.FirstOrDefaultAsync(t => t.TableCode == request.TableCode);
            if (table is null)
                return BadRequest(ServiceResult<OrderDto>.Fail("Invalid table code"));
        }

        // Extract menu item IDs
        var menuItemIds = request.Items.Select(x => x.MenuItemId).ToList();

        // Fetch matching menu items from DB
        var products = await context.MenuItems
            .AsNoTracking()
            .Where(x => menuItemIds.Contains(x.Id))
            .ToListAsync();

        var productMap = products.ToDictionary(p => p.Id);
        var missing = menuItemIds.Where(id => !productMap.ContainsKey(id)).ToList();

        if (missing.Count > 0)
            return BadRequest(ServiceResult<OrderDto>.Fail($"Invalid menu item ids: {string.Join(", ", missing)}"));

        // Build order items
        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        foreach (var item in request.Items)
        {
            var product = productMap[item.MenuItemId];
            subtotal += product.Price * item.Quantity;

            orderItems.Add(new OrderItem
            {
                ItemOrdered = new MenuItemOrdered
                {
                    MenuItemId = product.Id,
                    Name = product.Name,
                    ImageUrl = product.ImageUrl
                },
                Price = product.Price,
                Quantity = item.Quantity,
                Note = item.Note
            });
        }

        // Validate discount
        var discount = request.Discount;
        if (discount < 0)
            return BadRequest(ServiceResult<OrderDto>.Fail("Discount cannot be negative"));
        if (discount > subtotal)
            return BadRequest(ServiceResult<OrderDto>.Fail("Discount cannot exceed subtotal"));

        await using var tx = await context.Database.BeginTransactionAsync();

        try
        {
            // TableId nullable; only set if a real table exists
            var order = new Order
            {
                TableId = table?.Id,
                TableCode = table?.TableCode ?? string.Empty,
                OrderType = normalizedOrderType,
                NumberOfPeople = request.NumberOfPeople,
                BuyerName = request.BuyerName,
                BuyerEmail = request.BuyerEmail ?? string.Empty,
                BuyerNote = request.BuyerNote ?? string.Empty,
                OrderItems = orderItems,
                Subtotal = subtotal,
                Discount = discount,
                OrderStatus = OrderStatus.Pending,
                OrderDate = DateTime.UtcNow
            };

            context.Orders.Add(order);

            // Update table status if needed
            if (table is not null && table.Status == TableStatus.Available)
                table.Status = TableStatus.Occupied;

            await context.SaveChangesAsync();

            // Commit transaction after successful save
            await tx.CommitAsync();

            // Build DTO directly from tracked order, no requery needed
            var dto = order.ToDto();

            return CreatedAtAction(
                nameof(GetOrderById),
                new { id = order.Id },
                ServiceResult<OrderDto>.Ok(dto, "Order created successfully")
            );
        }
        catch (Exception ex)
        {
            // Roll back on any error
            await tx.RollbackAsync();
            return BadRequest(ServiceResult<OrderDto>.Fail($"Failed to create order: {ex.Message}"));
        }
    }


    // Put /api/orders/{id}
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ServiceResult<Order>>> UpdateOrder(int id, [FromBody] UpdateOrderDto dto)
    {
        var order = await context.Orders.FindAsync(id);
        if (order is null)
            return NotFound(ServiceResult<Order>.Fail("Order not found"));

        order.BuyerName = dto.BuyerName;
        order.BuyerEmail = dto.BuyerEmail;
        order.BuyerNote = dto.BuyerNote;
        order.TableCode = dto.TableCode;
        if (!string.IsNullOrWhiteSpace(dto.OrderType))
            order.OrderType = dto.OrderType;
        if (dto.NumberOfPeople.HasValue)
            order.NumberOfPeople = dto.NumberOfPeople;

        var success = await context.SaveChangesAsync() > 0;
        if (!success) return BadRequest(ServiceResult<Order>.Fail("Failed to update order"));

        return Ok(ServiceResult<OrderDto>.Ok(order.ToDto(), "Order updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ServiceResult<string>>> DeleteOrder(int id)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null)
            return NotFound(ServiceResult<string>.Fail("Order not found"));

        context.Orders.Remove(order);
        var success = await context.SaveChangesAsync() > 0;

        if (!success)
            return BadRequest(ServiceResult<string>.Fail("Failed to delete order"));

        return Ok(ServiceResult<string>.Ok(null, "Order deleted successfully"));
    }

}
