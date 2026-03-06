using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using HotChocolate.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CatLife.API.GraphQL.Queries;

public class Query
{
    [Authorize]
    public async Task<User?> GetMeAsync([FromServices] IUserRepository userRepository, ClaimsPrincipal claimsPrincipal)
    {
        var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);
        
        if (string.IsNullOrEmpty(email))
        {
            return null;
        }

        return await userRepository.GetByEmailAsync(email);
    }

    [Authorize]
    public async Task<IEnumerable<Cat>> GetMyCatsAsync([FromServices] ICatService catService, ClaimsPrincipal claimsPrincipal)
    {
        var userIdString = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (!int.TryParse(userIdString, out int userId))
        {
            return new List<Cat>();
        }

        return await catService.GetMyCatsAsync(userId);
    }

    [Authorize]
    public async Task<IEnumerable<HealthRecord>> GetHealthRecordsAsync(int catId, string? type, [FromServices] IHealthRecordService healthService)
    {
        return await healthService.GetHealthRecordsAsync(catId, type);
    }

    [Authorize]
    public async Task<IEnumerable<Expense>> GetExpensesAsync(int catId, [FromServices] IExpenseService expenseService)
    {
        return await expenseService.GetExpensesAsync(catId);
    }

    [Authorize]
    public async Task<IEnumerable<Appointment>> GetAppointmentsAsync(int catId, [FromServices] IAppointmentService appointmentService)
    {
        return await appointmentService.GetAppointmentsAsync(catId);
    }

    [Authorize]
    public async Task<TelegramLink?> GetMyTelegramLink([FromServices] ITelegramLinkRepository repository, ClaimsPrincipal claimsPrincipal)
    {
        var userIdStr = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId)) return null;

        return await repository.GetByUserIdAsync(userId);
    }
}