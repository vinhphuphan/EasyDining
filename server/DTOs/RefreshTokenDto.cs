using System;

namespace server.DTOs;

public class RefreshTokenDto
{
    public int UserId { get; set; }
    public string RefreshToken { get; set; } = string.Empty;
}
