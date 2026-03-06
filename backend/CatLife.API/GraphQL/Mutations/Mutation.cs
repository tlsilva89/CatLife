using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;
using HotChocolate.Authorization;
using System.Security.Claims;

namespace CatLife.API.GraphQL.Mutations;

public class Mutation
{
    private int GetUserId(ClaimsPrincipal principal)
    {
        var userIdString = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdString, out int userId) ? userId : 0;
    }

    public async Task<AuthPayload> RegisterAsync(RegisterInput input, [Service] IAuthService authService) => 
        await authService.RegisterAsync(input);

    public async Task<AuthPayload> LoginAsync(LoginInput input, [Service] IAuthService authService) => 
        await authService.LoginAsync(input);

    [Authorize]
    public async Task<Cat?> CreateCatAsync(CreateCatInput input, [Service] ICatService catService, ClaimsPrincipal claimsPrincipal) => 
        await catService.CreateCatAsync(GetUserId(claimsPrincipal), input);

    [Authorize]
    public async Task<Cat?> UpdateCatAsync(int catId, UpdateCatInput input, [Service] ICatService catService, ClaimsPrincipal claimsPrincipal) => 
        await catService.UpdateCatAsync(GetUserId(claimsPrincipal), catId, input);

    [Authorize]
    public async Task<bool> DeleteCatAsync(int catId, [Service] ICatService catService, ClaimsPrincipal claimsPrincipal) => 
        await catService.DeleteCatAsync(GetUserId(claimsPrincipal), catId);

    [Authorize]
    public async Task<HealthRecord> AddHealthRecordAsync(AddHealthRecordInput input, [Service] IHealthRecordService healthService) => 
        await healthService.AddHealthRecordAsync(input);

    [Authorize]
    public async Task<Expense> AddExpenseAsync(AddExpenseInput input, [Service] IExpenseService expenseService) => 
        await expenseService.AddExpenseAsync(input);

    [Authorize]
    public async Task<Appointment> AddAppointmentAsync(AddAppointmentInput input, [Service] IAppointmentService appointmentService) => 
        await appointmentService.AddAppointmentAsync(input);

    [Authorize]
    public async Task<string> ConsultAiVetAsync(int catId, string symptoms, [Service] IAiConsultService aiService, [Service] IAiConsultRepository consultRepo)
    {
        var response = await aiService.AnalyzeSymptomsAsync(symptoms);
        await consultRepo.AddAsync(new AIConsult { CatId = catId, Symptoms = symptoms, UrgencyLevel = "Processado via IA" });
        await consultRepo.SaveChangesAsync();
        return response;
    }

    [Authorize]
    public async Task<TelegramLink?> LinkTelegramAccountAsync(string chatId, [Service] ITelegramLinkRepository linkRepo, ClaimsPrincipal claimsPrincipal)
    {
        var userId = GetUserId(claimsPrincipal);
        if (userId == 0) return null;

        var result = await linkRepo.AddOrUpdateAsync(new TelegramLink { UserId = userId, ChatId = chatId });
        await linkRepo.SaveChangesAsync();
        return result;
    }
}