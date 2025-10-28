namespace server.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string PinCodeHash { get; set; } = string.Empty;
    public string? Avatar { get; set; } = string.Empty;
    public string? ShiftStart { get; set; } = string.Empty;
    public string? ShiftEnd { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    // Refresh token
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}
