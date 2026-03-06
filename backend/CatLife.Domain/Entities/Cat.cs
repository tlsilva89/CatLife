namespace CatLife.Domain.Entities;

public class Cat : BaseEntity
{
    public required string Name { get; set; }
    public string? Breed { get; set; }
    public string? Color { get; set; }
    public DateTime BirthDate { get; set; }
    public bool IsCastrated { get; set; }

    public int UserId { get; set; }
    public User? Owner { get; set; }

    public ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<AIConsult> AIConsults { get; set; } = new List<AIConsult>();
}