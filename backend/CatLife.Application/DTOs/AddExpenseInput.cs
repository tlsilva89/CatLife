namespace CatLife.Application.DTOs;

public class AddExpenseInput
{
    public int CatId { get; set; }
    public required string Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}