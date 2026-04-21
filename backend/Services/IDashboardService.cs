using Altairis.API.DTOs.Dashboard;

namespace Altairis.API.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}
