using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IAiConsultRepository
{
    Task<AIConsult> AddAsync(AIConsult consult);
    Task SaveChangesAsync();
}