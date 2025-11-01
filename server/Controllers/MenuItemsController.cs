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
    }
}
