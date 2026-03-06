using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class HealthRecordRepository : IHealthRecordRepository
{
    private readonly CatLifeDbContext _context;

    public HealthRecordRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HealthRecord>> GetByCatIdAsync(int catId, string? type)
    {
        var query = _context.HealthRecords.Where(h => h.CatId == catId).AsQueryable();
        if (!string.IsNullOrEmpty(type)) query = query.Where(h => h.Type == type);
        return await query.ToListAsync();
    }

    public async Task<HealthRecord?> GetByIdAsync(int id)
    {
        return await _context.HealthRecords.FindAsync(id);
    }

    public async Task<HealthRecord> AddAsync(HealthRecord record)
    {
        await _context.HealthRecords.AddAsync(record);
        return record;
    }

    public async Task UpdateAsync(HealthRecord record)
    {
        _context.HealthRecords.Update(record);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(HealthRecord record)
    {
        _context.HealthRecords.Remove(record);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}