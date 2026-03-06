namespace CatLife.Domain.Entities;

public class AIConsult : BaseEntity
{
    public int CatId { get; set; }
    public Cat? Cat { get; set; }

    public required string Symptoms { get; set; }
    public required string UrgencyLevel { get; set; }
}