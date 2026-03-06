using CatLife.Application.DTOs;
using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<Expense>> GetExpensesAsync(int catId);
    Task<Expense> AddExpenseAsync(AddExpenseInput input);
}