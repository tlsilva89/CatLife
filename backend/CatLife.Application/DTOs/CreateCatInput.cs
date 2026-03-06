namespace CatLife.Application.DTOs;

public class CreateCatInput
{
    public required string Name { get; set; }
    public string? Breed { get; set; }
    public string? Color { get; set; }
    public DateTime BirthDate { get; set; }
    public bool IsCastrated { get; set; }
}