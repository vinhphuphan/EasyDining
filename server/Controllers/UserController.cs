using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.User;
using server.Entities;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController(AppDbContext context) : BaseApiController<User>(context)
    {
        private static readonly string[] AllowedRoles = ["Admin", "Staff"];

        // Disable inherited POST
        [NonAction]
        public override Task<ActionResult<User>> Create(User entity) => Task.FromResult<ActionResult<User>>(BadRequest());

        // Disable inherited PUT
        [NonAction]
        public override Task<IActionResult> Update(int id, User entity) => Task.FromResult<IActionResult>(BadRequest());

        // Create User Using DTO
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] UserDto dto)
        {
            if (_context.Users.Any(u => u.Username == dto.Username))
                return Conflict(new { message = "Username already exists." });

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                _context.Users.Any(u => u.Email == dto.Email))
                return Conflict(new { message = "Email already exists." });

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Role = dto.Role,
                Avatar = dto.Avatar,
                ShiftStart = dto.ShiftStart,
                ShiftEnd = dto.ShiftEnd,
                PinCodeHash = Hash(dto.PinCode)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        //  Update User Using DTO
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found." });

            if (!AllowedRoles.Contains(dto.Role))
                return BadRequest(new { message = $"Role '{dto.Role}' is not allowed." });

            // Prevent duplicate username
            if (_context.Users.Any(u => u.Username == dto.Username && u.Id != id))
                return Conflict(new { message = "Username already exists." });

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                _context.Users.Any(u => u.Email == dto.Email && u.Id != id))
                return Conflict(new { message = "Email already exists." });

            // Map DTO fields
            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Role = dto.Role;
            user.Avatar = dto.Avatar;
            user.ShiftStart = dto.ShiftStart;
            user.ShiftEnd = dto.ShiftEnd;

            if (!string.IsNullOrWhiteSpace(dto.PinCode))
                user.PinCodeHash = Hash(dto.PinCode);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "User updated successfully." });
        }

        private static string Hash(string input)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(bytes);
        }
    }
}
