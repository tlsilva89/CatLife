namespace CatLife.Domain.Entities;

public class HealthRecord : BaseEntity
{
    public int CatId { get; set; }
    public Cat? Cat { get; set; }

    public required string Type { get; set; } 
    public DateTime Date { get; set; }
    public DateTime? NextDueDate { get; set; }
}