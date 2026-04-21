using Altairis.API.DTOs.Booking;
using Altairis.API.DTOs.Common;
using Altairis.API.Models;

namespace Altairis.API.Repositories;

public interface IBookingRepository
{
    Task<PagedResult<Booking>> GetAllAsync(BookingQueryParams queryParams);
    Task<Booking?> GetByIdAsync(int id);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking?> UpdateStatusAsync(int id, BookingStatus status);
    Task<IEnumerable<Booking>> GetRecentAsync(int count);
    Task<Dictionary<string, int>> GetBookingsByStatusAsync();
    Task<IEnumerable<(DateTime Date, int Count, decimal Revenue)>> GetTrendAsync(int days);
}
