using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetByCatIdAsync(int catId);
    Task<Expense> AddAsync(Expense expense);
    Task SaveChangesAsync();
}