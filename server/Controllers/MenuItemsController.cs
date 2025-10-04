using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController(AppDbContext context) : ControllerBase
    {
        // GET: api/menuitems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems() => Ok(await context.MenuItems.ToListAsync());

        // GET: api/menuitems/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MenuItem>> GetMenuItemById(int id)
        {
            var menuItem = await context.MenuItems.FindAsync(id);
            return (menuItem == null) ? NotFound(new { message = $"MenuItem with ID {id} not found." }) : Ok(menuItem);
        }

        // POST: api/menuitems
        [HttpPost]
        public async Task<ActionResult<MenuItem>> CreateMenuItem([FromBody] MenuItem menuItem)
        {
            context.MenuItems.Add(menuItem);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMenuItemById), new { id = menuItem.Id }, menuItem);
        }

        // PUT: api/menuitems/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] MenuItem menuItem)
        {
            if (menuItem.Id != id || !MenuItemExists(id)) return BadRequest();
            context.Entry(menuItem).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/menuitems/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await context.MenuItems.FindAsync(id);
            if (menuItem == null) return NotFound(new { message = $"MenuItem with ID {id} not found." });
            context.MenuItems.Remove(menuItem);
            await context.SaveChangesAsync();
            return NoContent();
        }

        // Utility Method
        private bool MenuItemExists(int id) => context.MenuItems.Any(p => p.Id == id);
    }
}
