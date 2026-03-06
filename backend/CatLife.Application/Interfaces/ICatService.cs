using CatLife.Application.DTOs;
using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface ICatService
{
    Task<IEnumerable<Cat>> GetMyCatsAsync(int userId);
    Task<Cat> CreateCatAsync(int userId, CreateCatInput input);
    Task<Cat?> UpdateCatAsync(int userId, int catId, UpdateCatInput input);
    Task<bool> DeleteCatAsync(int userId, int catId);
}