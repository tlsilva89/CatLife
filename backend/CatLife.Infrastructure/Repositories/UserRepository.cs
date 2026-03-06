using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly CatLifeDbContext _context;

    public UserRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}