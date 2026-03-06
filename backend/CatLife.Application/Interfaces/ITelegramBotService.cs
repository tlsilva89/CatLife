namespace CatLife.Application.Interfaces;

public interface ITelegramBotService
{
    Task SendMessageAsync(string chatId, string message);
    void StartReceiving();
}