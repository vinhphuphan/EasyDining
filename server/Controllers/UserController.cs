using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Entities;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : BaseApiController<User>
    {
        public UserController(AppDbContext context) : base(context) { }
    }
}
