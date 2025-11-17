namespace server.DTOs.User;

public class UserDto
{
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string PinCode { get; set; } = string.Empty;
    public string? Avatar { get; set; } = string.Empty;
    public string? ShiftStart { get; set; } = string.Empty;
    public string? ShiftEnd { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
