using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface ICatRepository
{
    Task<IEnumerable<Cat>> GetByUserIdAsync(int userId);
    Task<Cat?> GetByIdAsync(int id);
    Task<Cat> AddAsync(Cat cat);
    Task UpdateAsync(Cat cat);
    Task DeleteAsync(Cat cat);
    Task SaveChangesAsync();
}