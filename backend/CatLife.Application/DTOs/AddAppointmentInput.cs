namespace CatLife.Application.DTOs;

public class AddAppointmentInput
{
    public int CatId { get; set; }
    public required string Type { get; set; }
    public DateTime DateTime { get; set; }
    public string? Location { get; set; }
}