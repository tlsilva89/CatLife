using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly CatLifeDbContext _context;

    public ExpenseRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Expense>> GetByCatIdAsync(int catId)
    {
        return await _context.Expenses.Where(e => e.CatId == catId).ToListAsync();
    }

    public async Task<Expense> AddAsync(Expense expense)
    {
        await _context.Expenses.AddAsync(expense);
        return expense;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}