using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;

namespace CatLife.Infrastructure.Repositories;

public class AiConsultRepository : IAiConsultRepository
{
    private readonly CatLifeDbContext _context;

    public AiConsultRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<AIConsult> AddAsync(AIConsult consult)
    {
        await _context.AIConsults.AddAsync(consult);
        return consult;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}