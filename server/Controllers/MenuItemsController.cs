using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController(AppDbContext context) : BaseApiController<MenuItem>(context) { }
}
