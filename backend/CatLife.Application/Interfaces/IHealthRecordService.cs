using CatLife.Application.DTOs;
using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IHealthRecordService
{
    Task<IEnumerable<HealthRecord>> GetHealthRecordsAsync(int catId, string? type);
    Task<HealthRecord> AddHealthRecordAsync(AddHealthRecordInput input);
    Task<HealthRecord?> UpdateHealthRecordAsync(int userId, int recordId, UpdateHealthRecordInput input);
    Task<bool> DeleteHealthRecordAsync(int userId, int recordId);
}