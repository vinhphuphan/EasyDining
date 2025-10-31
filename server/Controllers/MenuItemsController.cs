using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
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
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategoriesAsync()
        {
            var categories = await _context.MenuItems
                .Where(m => !string.IsNullOrEmpty(m.Category))
                .Select(m => m.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }
    }
}
