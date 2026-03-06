using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using CatLife.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly CatLifeDbContext _context;

    public AppointmentRepository(CatLifeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Appointment>> GetByCatIdAsync(int catId)
    {
        return await _context.Appointments.Where(a => a.CatId == catId).ToListAsync();
    }

    public async Task<Appointment> AddAsync(Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
        return appointment;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}