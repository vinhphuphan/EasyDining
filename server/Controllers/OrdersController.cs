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
    [Authorize]
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
    public async Task<ActionResult<ServiceResult<Order>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ServiceResult<Order>.Fail("Invalid order data"));

        // Validate table exists
        var table = await context.Tables.FirstOrDefaultAsync(t => t.TableCode == request.TableCode);

        if (table is null) return BadRequest(new { message = "Invalid table code" });

        // Extract all menu item IDs from the request
        var menuItemIds = request.Items.Select(x => x.MenuItemId).ToList();

        // Fetch matching menu items from the database (read-only)
        var products = await context.MenuItems
            .AsNoTracking()
            .Where(x => menuItemIds.Contains(x.Id))
            .ToListAsync();

        // Convert fetched IDs into a HashSet for O(1) lookup performance
        var dbIds = products.Select(p => p.Id).ToHashSet();

        // Check for menu item IDs that were requested but not found in the database
        var missing = menuItemIds.Where(id => !dbIds.Contains(id)).Distinct().ToList();

        // If any menu IDs are invalid, return a failure response
        if (missing.Count > 0)
            return BadRequest(ServiceResult<Order>.Fail($"Invalid menu item ids: {string.Join(", ", missing)}"));

        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        // Convert DB results to dictionary for O(1) lookup inside the loop
        var productsById = products.ToDictionary(p => p.Id);

        // Build order items
        foreach (var item in request.Items)
        {
            // Lookup product directly from dictionary
            var product = productsById[item.MenuItemId];

            var ordered = new MenuItemOrdered
            {
                MenuItemId = product.Id,
                Name = product.Name,
                ImageUrl = product.ImageUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = ordered,
                Price = product.Price,
                Quantity = item.Quantity,
                Note = item.Note
            };

            subtotal += product.Price * item.Quantity;
            orderItems.Add(orderItem);
        }

        var order = new Order
        {
            TableCode = request.TableCode,
            BuyerName = request.BuyerName,
            BuyerEmail = request.BuyerEmail ?? string.Empty,
            OrderItems = orderItems,
            Subtotal = subtotal,
            Discount = 0,
            OrderStatus = OrderStatus.Pending,
            OrderDate = DateTime.UtcNow
        };

        context.Orders.Add(order);

        if (table.Status == TableStatus.Available) table.Status = TableStatus.Occupied;

        var success = await context.SaveChangesAsync() > 0;

        if (!success)
        {
            return BadRequest(ServiceResult<Order>.Fail("Failed to create order"));
        }

        var created = await context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ItemOrdered)
                    .FirstAsync(o => o.Id == order.Id);

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            ServiceResult<OrderDto>.Ok(created.ToDto(), "Order created successfully")
        );
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
        order.TableCode = dto.TableCode;

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
