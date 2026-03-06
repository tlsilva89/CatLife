namespace CatLife.Application.DTOs;

public record UpdateCatInput(string Name, string? Breed, string? Color, DateTime BirthDate, bool IsCastrated);
public record UpdateHealthRecordInput(string Type, DateTime Date, DateTime? NextDueDate);
public record UpdateExpenseInput(string Category, decimal Amount, DateTime Date);
public record UpdateAppointmentInput(string Type, DateTime DateTime, string? Location);