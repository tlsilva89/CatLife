using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;

namespace CatLife.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;

    public AppointmentService(IAppointmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Appointment>> GetAppointmentsAsync(int catId)
    {
        return await _repository.GetByCatIdAsync(catId);
    }

    public async Task<Appointment> AddAppointmentAsync(AddAppointmentInput input)
    {
        var appointment = new Appointment
        {
            CatId = input.CatId,
            Type = input.Type,
            DateTime = input.DateTime,
            Location = input.Location
        };

        await _repository.AddAsync(appointment);
        await _repository.SaveChangesAsync();

        return appointment;
    }
}