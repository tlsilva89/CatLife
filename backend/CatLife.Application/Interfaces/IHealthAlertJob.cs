namespace CatLife.Application.Interfaces;

public interface IHealthAlertJob
{
    Task ProcessAlertsAsync();
}