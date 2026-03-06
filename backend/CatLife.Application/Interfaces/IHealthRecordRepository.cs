using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IHealthRecordRepository
{
    Task<IEnumerable<HealthRecord>> GetByCatIdAsync(int catId, string? type);
    Task<HealthRecord?> GetByIdAsync(int id);
    Task<HealthRecord> AddAsync(HealthRecord record);
    Task UpdateAsync(HealthRecord record);
    Task DeleteAsync(HealthRecord record);
    Task SaveChangesAsync();
}