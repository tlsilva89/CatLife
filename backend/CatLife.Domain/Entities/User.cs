namespace CatLife.Domain.Entities;

public class User : BaseEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }

    public ICollection<Cat> Cats { get; set; } = new List<Cat>();
    public TelegramLink? TelegramLink { get; set; }
}