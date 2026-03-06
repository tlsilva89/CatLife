using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetByCatIdAsync(int catId);
    Task<Appointment> AddAsync(Appointment appointment);
    Task SaveChangesAsync();
}