using CatLife.Application.DTOs;
using CatLife.Domain.Entities;

namespace CatLife.Application.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<Appointment>> GetAppointmentsAsync(int catId);
    Task<Appointment> AddAppointmentAsync(AddAppointmentInput input);
}