using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;

namespace CatLife.Application.Services;

public class HealthRecordService : IHealthRecordService
{
    private readonly IHealthRecordRepository _repository;
    private readonly ICatRepository _catRepository;

    public HealthRecordService(IHealthRecordRepository repository, ICatRepository catRepository)
    {
        _repository = repository;
        _catRepository = catRepository;
    }

    public async Task<IEnumerable<HealthRecord>> GetHealthRecordsAsync(int catId, string? type)
    {
        return await _repository.GetByCatIdAsync(catId, type);
    }

    public async Task<HealthRecord> AddHealthRecordAsync(AddHealthRecordInput input)
    {
        var record = new HealthRecord
        {
            CatId = input.CatId,
            Type = input.Type,
            Date = DateTime.SpecifyKind(input.Date, DateTimeKind.Utc),
            NextDueDate = input.NextDueDate.HasValue 
                ? DateTime.SpecifyKind(input.NextDueDate.Value, DateTimeKind.Utc) 
                : null
        };

        await _repository.AddAsync(record);
        await _repository.SaveChangesAsync();
        return record;
    }

    public async Task<HealthRecord?> UpdateHealthRecordAsync(int userId, int recordId, UpdateHealthRecordInput input)
    {
        var record = await _repository.GetByIdAsync(recordId);
        if (record == null) return null;

        var cat = await _catRepository.GetByIdAsync(record.CatId);
        if (cat == null || cat.UserId != userId) return null;

        record.Type = input.Type;
        record.Date = DateTime.SpecifyKind(input.Date, DateTimeKind.Utc);
        record.NextDueDate = input.NextDueDate.HasValue 
            ? DateTime.SpecifyKind(input.NextDueDate.Value, DateTimeKind.Utc) 
            : null;
        record.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(record);
        await _repository.SaveChangesAsync();
        return record;
    }

    public async Task<bool> DeleteHealthRecordAsync(int userId, int recordId)
    {
        var record = await _repository.GetByIdAsync(recordId);
        if (record == null) return false;

        var cat = await _catRepository.GetByIdAsync(record.CatId);
        if (cat == null || cat.UserId != userId) return false;

        await _repository.DeleteAsync(record);
        await _repository.SaveChangesAsync();
        return true;
    }
}