using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;

namespace CatLife.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _repository;

    public ExpenseService(IExpenseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Expense>> GetExpensesAsync(int catId)
    {
        return await _repository.GetByCatIdAsync(catId);
    }

    public async Task<Expense> AddExpenseAsync(AddExpenseInput input)
    {
        var expense = new Expense
        {
            CatId = input.CatId,
            Category = input.Category,
            Amount = input.Amount,
            Date = input.Date
        };

        await _repository.AddAsync(expense);
        await _repository.SaveChangesAsync();

        return expense;
    }
}