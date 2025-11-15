namespace server.DTOs.Auth;

public class RefreshTokenDto
{
    public int UserId { get; set; }
    public string RefreshToken { get; set; } = string.Empty;
}
