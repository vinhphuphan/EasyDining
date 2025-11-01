using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TablesController(AppDbContext context) : BaseApiController<Table>(context)
    {
        [AllowAnonymous]
        [HttpGet("verify")]
        public async Task<ActionResult<object>> Verify([FromQuery] string code, [FromServices] AppDbContext context)
        {
            if (string.IsNullOrWhiteSpace(code)) return BadRequest(new { message = "Invalid code" });
            var table = await context.Tables.FirstOrDefaultAsync(t => t.TableCode == code);
            if (table is null) return NotFound(new { message = "Table not found" });
            return Ok(new { tableName = table.Name, seats = table.Seats, status = table.Status });
        }
    }
}
