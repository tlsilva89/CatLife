using CatLife.Application.Interfaces;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Jobs;

public class HealthAlertJob : IHealthAlertJob
{
    private readonly CatLifeDbContext _context;
    private readonly ITelegramBotService _telegramBotService;

    public HealthAlertJob(CatLifeDbContext context, ITelegramBotService telegramBotService)
    {
        _context = context;
        _telegramBotService = telegramBotService;
    }

    public async Task ProcessAlertsAsync()
    {
        var limitDate = DateTime.UtcNow.Date.AddDays(3);

        var upcomingRecords = await _context.HealthRecords
            .Include(h => h.Cat)
            .ThenInclude(c => c!.Owner)
            .ThenInclude(u => u!.TelegramLink)
            .Where(h => h.NextDueDate.HasValue && h.NextDueDate.Value.Date <= limitDate)
            .ToListAsync();

        foreach (var record in upcomingRecords)
        {
            if (record.Cat?.Owner?.TelegramLink != null)
            {
                var chatId = record.Cat.Owner.TelegramLink.ChatId;
                var dueDate = record.NextDueDate!.Value.ToString("dd/MM/yyyy");
                var message = $"🚨 Alerta CatLife: O registro de saúde '{record.Type}' do(a) {record.Cat.Name} vence no dia {dueDate}!";
                
                await _telegramBotService.SendMessageAsync(chatId, message);
            }
        }
    }
}