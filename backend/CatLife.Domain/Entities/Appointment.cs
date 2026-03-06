namespace CatLife.Domain.Entities;

public class Appointment : BaseEntity
{
    public int CatId { get; set; }
    public Cat? Cat { get; set; }

    public required string Type { get; set; }
    public DateTime DateTime { get; set; }
    public string? Location { get; set; }
}