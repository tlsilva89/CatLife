using CatLife.Domain.Entities;

namespace CatLife.Application.DTOs;

public class AuthPayload
{
    public required User User { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}