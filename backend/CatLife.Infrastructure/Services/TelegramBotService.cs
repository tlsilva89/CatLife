using CatLife.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace CatLife.Infrastructure.Services;

public class TelegramBotService : ITelegramBotService
{
    private readonly ITelegramBotClient _botClient;
    private readonly ILogger<TelegramBotService> _logger;

    public TelegramBotService(IConfiguration configuration, ILogger<TelegramBotService> logger)
    {
        var token = configuration["Telegram:BotToken"] ?? throw new ArgumentNullException("TelegramBotToken");
        var options = new TelegramBotClientOptions(token);
        _botClient = new TelegramBotClient(options);
        _logger = logger;
    }

    public async Task SendMessageAsync(string chatId, string message)
    {
        await _botClient.SendTextMessageAsync(chatId, message);
    }

    public void StartReceiving()
    {
        var receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = Array.Empty<UpdateType>()
        };

        _botClient.StartReceiving(
            updateHandler: HandleUpdateAsync,
            pollingErrorHandler: HandlePollingErrorAsync,
            receiverOptions: receiverOptions
        );
    }

    private async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message is not { } message) return;
        if (message.Text is not { } messageText) return;

        var chatId = message.Chat.Id.ToString();

        await botClient.SendTextMessageAsync(
            chatId: chatId,
            text: $"Recebi sua mensagem: {messageText}\nGuarde este ID para vincular sua conta CatLife: {chatId}",
            cancellationToken: cancellationToken);
    }

    private Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Telegram Bot Error");
        return Task.CompletedTask;
    }
}