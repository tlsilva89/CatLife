namespace CatLife.Domain.Entities;

public class TelegramLink : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }

    public required string ChatId { get; set; }
    public DateTime LinkedAt { get; set; } = DateTime.UtcNow;
}