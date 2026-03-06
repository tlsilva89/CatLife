using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class CatRepository : ICatRepository
{
    private readonly CatLifeDbContext _context;

    public CatRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Cat>> GetByUserIdAsync(int userId)
    {
        return await _context.Cats.Where(c => c.UserId == userId).ToListAsync();
    }

    public async Task<Cat?> GetByIdAsync(int id)
    {
        return await _context.Cats.FindAsync(id);
    }

    public async Task<Cat> AddAsync(Cat cat)
    {
        await _context.Cats.AddAsync(cat);
        return cat;
    }

    public async Task UpdateAsync(Cat cat)
    {
        _context.Cats.Update(cat);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Cat cat)
    {
        _context.Cats.Remove(cat);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}