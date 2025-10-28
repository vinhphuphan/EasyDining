using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs;
using server.Entities;
using server.Helpers;
using server.Interfaces;

namespace server.Services;

public class AuthService(AppDbContext context, IConfiguration config) : IAuthService
{
    // REGISTER
    public async Task<ServiceResult<object>> RegisterAsync(UserDto request)
    {
        string[] ValidRoles = ["Admin", "User"];

        bool IsValidRole(string? role) => ValidRoles.Contains(role);

        if (string.IsNullOrWhiteSpace(request.Username) || request.Username.Length < 3)
            return ServiceResult<object>.Fail("Username must be at least 3 characters");

        if (string.IsNullOrWhiteSpace(request.PinCode) || request.PinCode.Length < 6)
            return ServiceResult<object>.Fail("PIN must be at least 6 digits");

        if (!IsValidRole(request.Role))
            return ServiceResult<object>.Fail("Invalid role");

        if (await context.Users.AnyAsync(u => u.Username == request.Username))
            return ServiceResult<object>.Fail("Username already exists");

        var user = new User
        {
            Username = request.Username,
            Role = request.Role,
            PinCodeHash = new PasswordHasher<User>().HashPassword(null!, request.PinCode)
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        var response = new
        {
            user.Id,
            user.Username,
            user.Role
        };

        return ServiceResult<object>.Ok(response, "User registered successfully");
    }

    // LOGIN
    public async Task<ServiceResult<object>> LoginAsync(LoginDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null)
            return ServiceResult<object>.Fail("User not found");

        var verify = new PasswordHasher<User>().VerifyHashedPassword(user, user.PinCodeHash, request.PinCode);
        if (verify == PasswordVerificationResult.Failed)
            return ServiceResult<object>.Fail("Invalid PIN code");

        var accessToken = CreateToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();

        var response = new
        {
            user = new
            {
                user.Id,
                user.Username,
                user.Avatar,
                user.ShiftStart,
                user.ShiftEnd,
                user.Role,
            },
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };

        return ServiceResult<object>.Ok(response, "Login successfully!");
    }

    // REFRESH TOKEN
    public async Task<ServiceResult<object>> RefreshTokenAsync(RefreshTokenDto tokenDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == tokenDto.UserId);
        if (user is null)
            return ServiceResult<object>.Fail("User not found");

        if (user.RefreshToken != tokenDto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return ServiceResult<object>.Fail("Invalid or expired refresh token");

        var newAccessToken = CreateToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();

        var response = new
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };

        return ServiceResult<object>.Ok(response, "Token refreshed successfully");
    }

    // LOGOUT
    public async Task<ServiceResult<bool>> LogoutAsync(string UserId)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == UserId);
        if (user is null)
            return ServiceResult<bool>.Fail("User not found");

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await context.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true, "Logged out successfully!");
    }

    // Helpers
    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private string CreateToken(User user)
    {
        var tokenKey = config["AppSettings:Token"];
        var issuer = config["AppSettings:Issuer"];
        var audience = config["AppSettings:Audience"];

        if (string.IsNullOrEmpty(tokenKey) || tokenKey.Length < 32)
            throw new InvalidOperationException("AppSettings:Token must be at least 32 characters");

        if (string.IsNullOrEmpty(issuer))
            throw new InvalidOperationException("AppSettings:Issuer is required");

        if (string.IsNullOrEmpty(audience))
            throw new InvalidOperationException("AppSettings:Audience is required");

        var claims = new List<Claim>
    {
        new(ClaimTypes.Name, user.Username),
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Role, user.Role)
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}
