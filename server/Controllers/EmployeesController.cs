using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController(AppDbContext context) : BaseApiController<Employee>(context)
    {
    }
}
