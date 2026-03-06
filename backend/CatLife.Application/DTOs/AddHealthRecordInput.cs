namespace CatLife.Application.DTOs;

public class AddHealthRecordInput
{
    public int CatId { get; set; }
    public required string Type { get; set; }
    public DateTime Date { get; set; }
    public DateTime? NextDueDate { get; set; }
}