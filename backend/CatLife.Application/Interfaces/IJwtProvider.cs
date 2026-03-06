using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IJwtProvider
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}