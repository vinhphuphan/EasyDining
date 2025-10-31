using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Entities.OrderAggregate;
using server.Helpers;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController(AppDbContext context) : ControllerBase
{
    // GET /api/orders
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<ServiceResult<PagedList<Order>>>> GetOrders(
    [FromQuery] string? tableCode,
    [FromQuery] OrderStatus? status,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20
    )
    {
        var query = context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.ItemOrdered)
            .OrderByDescending(o => o.OrderDate)
            .AsQueryable();

        if (!string.IsNullOrEmpty(tableCode))
            query = query.Where(o => o.TableCode == tableCode);

        if (status != null)
            query = query.Where(o => o.OrderStatus == status);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        query = query.AsNoTracking();

        var totalCount = await query.CountAsync();
        var orders = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(ServiceResult<PagedList<Order>>.Ok(
            new PagedList<Order>(orders, totalCount, page, pageSize)
        ));
    }

    // GET /api/orders/{id}
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServiceResult<Order>>> GetOrderById(int id)
    {
        var order = await context.Orders
            .AsNoTracking() // do not track entity
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.ItemOrdered)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null)
            return NotFound(ServiceResult<Order>.Fail("Order not found"));

        return Ok(ServiceResult<Order>.Ok(order));
    }

    // PUT /api/orders/update-status
    [Authorize]
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ServiceResult<Order>>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await context.Orders.FindAsync(id);

        if (order is null)
            return NotFound(ServiceResult<Order>.Fail("Order not found"));

        order.OrderStatus = dto.Status;
        var success = await context.SaveChangesAsync() > 0;

        if (!success) return BadRequest(ServiceResult<Order>.Fail("Failed to update order status"));

        return Ok(ServiceResult<Order>.Ok(order, "Order status updated successfully!"));
    }

    // POST /api/orders
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ServiceResult<Order>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ServiceResult<Order>.Fail("Invalid order data"));

        // Validate table exists
        var tableExists = await context.Tables
            .AsNoTracking()
            .AnyAsync(t => t.HashCode == request.TableCode);

        if (!tableExists)
            return BadRequest(ServiceResult<Order>.Fail("Invalid table code"));

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
            return BadRequest(ServiceResult<Order>.Fail("One or more menu items are invalid"));

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
            BuyerEmail = request.BuyerEmail,
            OrderItems = orderItems,
            Subtotal = subtotal,
            Discount = 0,
            OrderStatus = OrderStatus.Pending,
            OrderDate = DateTime.UtcNow
        };

        context.Orders.Add(order);

        var success = await context.SaveChangesAsync() > 0;

        if (!success)
        {
            return BadRequest(ServiceResult<Order>.Fail("Failed to create order"));
        }

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            ServiceResult<Order>.Ok(order, "Order created successfully"
        ));
    }

    // Put /api/orders/{id}
    [Authorize]
    [HttpPut("{id:int}")]
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

        return Ok(ServiceResult<Order>.Ok(order, "Order updated successfully"));
    }

    [Authorize]
    [HttpDelete("{id:int}")]
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
