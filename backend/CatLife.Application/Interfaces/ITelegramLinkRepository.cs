using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface ITelegramLinkRepository
{
    Task<TelegramLink?> GetByUserIdAsync(int userId);
    Task<TelegramLink> AddOrUpdateAsync(TelegramLink link);
    Task SaveChangesAsync();
}