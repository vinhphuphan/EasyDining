using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Specifications;
using System.Linq.Expressions;

namespace server.Controllers

{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController<T> : ControllerBase where T : BaseEntity
    {
        protected readonly AppDbContext _context;

        // Thay đổi constructor để nhận AppDbContext trực tiếp
        public BaseApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/[controller]
        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<T>>> ListAllWithSpec(
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30)
        {
            var spec = new BaseSpecification<T>
            {
                OrderBy = BuildOrderBy(sort),
                Skip = Math.Max(0, (page - 1)) * Math.Max(1, pageSize),
                Take = Math.Max(1, pageSize)
            };

            var query = _context.Set<T>().AsQueryable();
            query = ApplySpecification(query, spec);

            var result = await query.ToListAsync();
            return Ok(result);
        }

        // GET: api/[controller]/5
        [HttpGet("{id:int}")]
        public virtual async Task<ActionResult<T>> GetById(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            return (entity == null) ? NotFound(new { message = $"{typeof(T).Name} with ID {id} not found." }) : Ok(entity);
        }

        // POST: api/[controller]
        [HttpPost]
        public virtual async Task<ActionResult<T>> Create([FromBody] T entity)
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
        }

        // PUT: api/[controller]/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] T entity)
        {
            if (entity.Id != id || !Exists(id)) return BadRequest();
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/[controller]/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null) return NotFound(new { message = $"{typeof(T).Name} with ID {id} not found." });
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Utility Method
        private bool Exists(int id) => _context.Set<T>().Any(e => e.Id == id);

        protected static IQueryable<T> ApplySpecification(IQueryable<T> query, BaseSpecification<T> spec)
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


        protected static Func<IQueryable<T>, IOrderedQueryable<T>> BuildOrderBy(string? sort)
        {
            return query =>
            {
                if (string.IsNullOrWhiteSpace(sort))
                    return query.OrderBy(e => EF.Property<object>(e, nameof(BaseEntity.Id)));

                return sort.ToLower() switch
                {
                    "nameasc" => query.OrderBy(e => EF.Property<object>(e, "Name")),
                    "namedesc" => query.OrderByDescending(e => EF.Property<object>(e, "Name")),
                    "priceasc" => query.OrderBy(e => EF.Property<object>(e, "Price")),
                    "pricedesc" => query.OrderByDescending(e => EF.Property<object>(e, "Price")),
                    _ => query.OrderBy(e => EF.Property<object>(e, nameof(BaseEntity.Id)))
                };
            };
        }

    }
}