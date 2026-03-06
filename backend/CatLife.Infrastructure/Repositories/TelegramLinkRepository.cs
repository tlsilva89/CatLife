using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class TelegramLinkRepository : ITelegramLinkRepository
{
    private readonly CatLifeDbContext _context;

    public TelegramLinkRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<TelegramLink?> GetByUserIdAsync(int userId)
    {
        return await _context.TelegramLinks.FirstOrDefaultAsync(t => t.UserId == userId);
    }

    public async Task<TelegramLink> AddOrUpdateAsync(TelegramLink link)
    {
        var existing = await GetByUserIdAsync(link.UserId);
        
        if (existing != null)
        {
            existing.ChatId = link.ChatId;
            existing.LinkedAt = DateTime.UtcNow;
            _context.TelegramLinks.Update(existing);
            return existing;
        }

        await _context.TelegramLinks.AddAsync(link);
        return link;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}