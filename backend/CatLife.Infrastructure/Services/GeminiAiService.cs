using CatLife.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;

namespace CatLife.Infrastructure.Services;

public class GeminiAiService : IAiConsultService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiAiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("GeminiApiKey");
    }

    public async Task<string> AnalyzeSymptomsAsync(string symptoms)
    {
        try
        {
            var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = $"Você é um veterinário felino experiente. Analise os seguintes sintomas de um gato e diga o nível de urgência (Baixo, Médio, Alto), possíveis causas e recomendações. Lembre o tutor de procurar um profissional real se for grave. Sintomas: {symptoms}" }
                        }
                    }
                }
            };

            var jsonBody = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(requestUrl, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorDetail = await response.Content.ReadAsStringAsync();
                return $"ERRO DA API GOOGLE: Status {response.StatusCode} - {errorDetail}";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var jsonDocument = JsonDocument.Parse(responseString);
            
            var answer = jsonDocument.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return answer ?? "Nenhuma resposta gerada.";
        }
        catch (Exception ex)
        {
            return $"ERRO FATAL DE CONEXÃO: {ex.Message} | Inner: {ex.InnerException?.Message}";
        }
    }
}