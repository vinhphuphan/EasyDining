using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.MenuItem;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : BaseApiController<MenuItem>
    {
        public MenuItemsController(AppDbContext context) : base(context)
        {
        }

        [AllowAnonymous]
        [HttpGet]
        public override async Task<ActionResult<IEnumerable<MenuItem>>> ListAllWithSpec(
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30)
        {
            return await base.ListAllWithSpec(search, sort, page, pageSize);
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public override async Task<ActionResult<MenuItem>> GetById(int id)
        {
            return await base.GetById(id);
        }

        [AllowAnonymous]
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategoriesAsync(int id)
        {
            var categories = await _context.MenuItems
                .Where(m => !string.IsNullOrEmpty(m.Category))
                .Select(m => m.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }

        [NonAction]
        public override async Task<IActionResult> Update(int id, [FromBody] MenuItem entity)
            => await base.Update(id, entity);

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItemUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.MenuItems.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Menu item {id} not found." });

            try
            {
                existing.Name = dto.Name.Trim();
                existing.Price = dto.Price;
                existing.Description = dto.Description ?? "";
                existing.ImageUrl = dto.ImageUrl ?? "";
                existing.Category = dto.Category ?? "";
                existing.IsAvailable = dto.IsAvailable;
                existing.IsBest = dto.IsBest;
                existing.IsVeg = dto.IsVeg;
                existing.IsSpicy = dto.IsSpicy;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent(); // 204
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UpdateMenuItem] Error updating ID {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error updating menu item", detail = ex.Message });
            }
        }

    }
}
