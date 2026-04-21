using Altairis.API.DTOs.Availability;
using Altairis.API.Models;

namespace Altairis.API.Repositories;

public interface IAvailabilityRepository
{
    Task<IEnumerable<Availability>> GetAsync(AvailabilityQueryParams queryParams);
    Task<Availability?> GetByIdAsync(int id);
    Task<Availability?> GetByRoomTypeAndDateAsync(int roomTypeId, DateTime date);
    Task<Availability> CreateAsync(Availability availability);
    Task<Availability?> UpdateAsync(int id, Availability availability);
    Task BulkUpsertAsync(IEnumerable<Availability> availabilities);
}
