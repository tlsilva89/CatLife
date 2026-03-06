using CatLife.Application.DTOs;

namespace CatLife.Application.Interfaces;

public interface IAuthService
{
    Task<AuthPayload> RegisterAsync(RegisterInput input);
    Task<AuthPayload> LoginAsync(LoginInput input);
}