using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth;

public class LoginDto
{
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string PinCode { get; set; } = string.Empty;
}
