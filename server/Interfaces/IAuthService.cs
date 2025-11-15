using server.DTOs;
using server.DTOs.Auth;
using server.Helpers;

namespace server.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<object>> RegisterAsync(UserDto request);
    Task<ServiceResult<object>> LoginAsync(LoginDto request);
    Task<ServiceResult<object>> RefreshTokenAsync(RefreshTokenDto tokenDto);
    Task<ServiceResult<bool>> LogoutAsync(string userId);
}
