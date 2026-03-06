namespace CatLife.Application.Interfaces;

public interface IAiConsultService
{
    Task<string> AnalyzeSymptomsAsync(string symptoms);
}