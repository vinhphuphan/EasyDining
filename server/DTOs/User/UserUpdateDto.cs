using System.ComponentModel.DataAnnotations;

namespace server.DTOs.User
{
    public class UserUpdateDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        public string? Email { get; set; }

        // Optional when update
        public string? PinCode { get; set; }

        public string? Avatar { get; set; }
        public string? ShiftStart { get; set; }
        public string? ShiftEnd { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}