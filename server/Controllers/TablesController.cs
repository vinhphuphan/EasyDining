using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.Table;
using server.Entities;
using server.Entities.OrderAggregate;
using server.Helpers;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController(AppDbContext _context) : ControllerBase
    {
        /// <summary>
        /// Verifies a table by its unique QR/table code.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("verify")]
        public async Task<ActionResult<object>> Verify([FromQuery] string code)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest(ServiceResult<object>.Fail("Invalid table code."));

            // Retrieve table by its code
            var table = await _context.Tables.FirstOrDefaultAsync(t => t.TableCode == code);

            if (table is null)
                return NotFound(new { message = "Table not found" });

            // Return minimal table info for client display
            return Ok(ServiceResult<object>.Ok(new
            {
                tableName = table.Name,
                seats = table.Seats,
                status = table.Status.ToString()
            }, "Table verified successfully."));
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<ServiceResult<IEnumerable<TableDto>>>> GetAll()
        {
            var tables = await _context.Tables
                .Include(t => t.Orders)
                    .ThenInclude(o => o.OrderItems)
                .AsNoTracking()
                .ToListAsync();

            var result = tables.Select(t => t.ToDto()).ToList();

            return Ok(ServiceResult<IEnumerable<TableDto>>.Ok(result, "Tables retrieved successfully."));
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ServiceResult<TableDto>>> GetTableById(int id)
        {
            var table = await _context.Tables
                .Include(t => t.Orders)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.ItemOrdered)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);

            if (table is null)
                return NotFound(ServiceResult<TableDto>.Fail($"Table with ID {id} not found."));

            return Ok(ServiceResult<TableDto>.Ok(table.ToDto(), "Table retrieved successfully."));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ServiceResult<TableDto>>> Create([FromBody] CreateTableDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ServiceResult<TableDto>.Fail("Invalid table data."));

            var table = new Table
            {
                Name = dto.Name,
                Seats = dto.Seats,
                Status = TableStatus.Available
            };

            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTableById), new { id = table.Id },
                ServiceResult<TableDto>.Ok(table.ToDto(), "Table created successfully."));
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ServiceResult<Table>>> Update(int id, [FromBody] UpdateTableDto dto)
        {
            // Validate ID and data
            if (dto is null)
                return BadRequest(ServiceResult<Table>.Fail("Invalid data"));

            // Find table
            var table = await _context.Tables.FindAsync(id);
            if (table is null)
                return NotFound(ServiceResult<Table>.Fail("Table not found"));

            // Update fields
            table.Name = dto.Name;
            table.Seats = dto.Seats;
            table.Status = dto.Status;

            var success = await _context.SaveChangesAsync() > 0;

            if (!success)
                return StatusCode(500, ServiceResult<Table>.Fail("Failed to update table"));

            // Trả về response
            return Ok(ServiceResult<Table>.Ok(table, "Table updated successfully"));
        }

        /// <summary>
        /// Updates the status of a specific table (e.g., Available, Occupied).
        /// </summary>
        [Authorize]
        [HttpPut("update-status")]
        public async Task<ActionResult> UpdateStatus([FromBody] UpdateTableStatusDto dto)
        {
            if (!Enum.TryParse<TableStatus>(dto.Status, true, out var newStatus))
            {
                var valid = string.Join(", ", Enum.GetNames<TableStatus>());
                return BadRequest(new { message = $"Invalid status '{dto.Status}'. Valid statuses: {valid}" });
            }

            var table = await _context.Tables.FindAsync(dto.TableId);
            if (table is null) return NotFound(new { message = "Table not found" });

            table.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Table status set to {newStatus}" });
        }

        /// <summary>
        /// Delete a table using table id
        /// </summary>
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ServiceResult<object>>> Delete(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table is null)
                return NotFound(ServiceResult<object>.Fail("Table not found."));

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();

            return Ok(ServiceResult<object>.Ok(null, $"Table '{table.Name}' deleted successfully."));
        }


        /// <summary>
        /// Checkout: Calculate the totals of active orders, reset table to Available,
        /// and return checkout details to the client.
        /// </summary>
        [Authorize]
        [HttpPost("{id:int}/checkout")]
        public async Task<ActionResult<ServiceResult<TableCheckoutDto>>> CheckoutTable(int id)
        {
            await using var tx = await _context.Database.BeginTransactionAsync();

            var table = await _context.Tables
                .Include(t => t.Orders.Where(o =>
                    o.OrderStatus != OrderStatus.Paid &&
                    o.OrderStatus != OrderStatus.Cancelled))
                    .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (table is null)
                return NotFound(ServiceResult<TableCheckoutDto>.Fail("Table not found"));

            var activeOrders = table.Orders;

            if (activeOrders.Count == 0)
            {
                table.Status = TableStatus.Available;
                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                var emptyDto = new TableCheckoutDto
                {
                    TableId = table.Id,
                    TableName = table.Name,
                    TableCode = table.TableCode,
                    OrdersCount = 0,
                    Orders = [],
                    TotalAmount = 0m,
                    CheckoutTimeUtc = DateTime.UtcNow
                };

                return Ok(ServiceResult<TableCheckoutDto>.Ok(emptyDto,
                    "No active orders. Table is available."));
            }

            var summaries = activeOrders.Select(o => new OrderSummaryItemDto
            {
                OrderId = o.Id,
                Subtotal = o.Subtotal,
                Discount = o.Discount,
                Total = o.GetTotal()
            }).ToList();

            foreach (var order in activeOrders)
                order.OrderStatus = OrderStatus.Paid;

            table.Status = TableStatus.Available;
            await _context.SaveChangesAsync();
            table.Orders.Clear();
            await tx.CommitAsync();

            return Ok(ServiceResult<TableCheckoutDto>.Ok(new TableCheckoutDto
            {
                TableId = table.Id,
                TableName = table.Name,
                TableCode = table.TableCode,
                OrdersCount = summaries.Count,
                Orders = summaries,
                TotalAmount = summaries.Sum(s => s.Total),
                CheckoutTimeUtc = DateTime.UtcNow
            }, "Checkout successfully"));
        }
    }
}