using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Entities;
using System.Linq.Expressions;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(AppDbContext context) : BaseApiController<Order>(context)
    {
        protected override Expression<Func<Order, bool>>? GetSearchCriteria(string? search)
        {
            if (string.IsNullOrWhiteSpace(search)) return null;

            return o => o.OrderNumber.Contains(search) || o.CustomerName.Contains(search);
        }
    }
}