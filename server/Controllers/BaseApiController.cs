using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Specifications;

namespace server.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController<T>(AppDbContext context) : ControllerBase where T : BaseEntity
    {
        // GET: api/[controller]
        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<T>>> ListAllWithSpec(
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            var spec = new BaseSpecification<T>
            {
                Criteria = !string.IsNullOrEmpty(search)
                    ? (e => EF.Functions.Like(e.ToString(), $"%{search}%"))
                    : null,
                OrderBy = !string.IsNullOrEmpty(sort)
                    ? (q => q.OrderBy(e => EF.Property<object>(e, sort)))
                    : null,
                Skip = (page - 1) * pageSize,
                Take = pageSize
            };

            var query = context.Set<T>().AsQueryable();
            query = ApplySpecification(query, spec);

            var result = await query.ToListAsync();
            return Ok(result);
        }

        // GET: api/[controller]/5
        [HttpGet("{id:int}")]
        public virtual async Task<ActionResult<T>> GetById(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            return (entity == null) ? NotFound(new { message = $"{typeof(T).Name} with ID {id} not found." }) : Ok(entity);
        }

        // POST: api/[controller]
        [HttpPost]
        public virtual async Task<ActionResult<T>> Create([FromBody] T entity)
        {
            context.Set<T>().Add(entity);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
        }

        // PUT: api/[controller]/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] T entity)
        {
            if (entity.Id != id || !Exists(id)) return BadRequest();
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/[controller]/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity == null) return NotFound(new { message = $"{typeof(T).Name} with ID {id} not found." });
            context.Set<T>().Remove(entity);
            await context.SaveChangesAsync();
            return NoContent();
        }

        // Utility Method
        private bool Exists(int id) => context.Set<T>().Any(e => e.Id == id);

        private static IQueryable<T> ApplySpecification(IQueryable<T> query, BaseSpecification<T> spec)
        {
            if (spec.Criteria != null)
                query = query.Where(spec.Criteria);

            if (spec.OrderBy != null)
                query = spec.OrderBy(query);

            if (spec.Skip.HasValue)
                query = query.Skip(spec.Skip.Value);

            if (spec.Take.HasValue)
                query = query.Take(spec.Take.Value);

            return query;
        }
    }
}