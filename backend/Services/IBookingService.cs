using Altairis.API.DTOs.Booking;
using Altairis.API.DTOs.Common;
using Altairis.API.Models;

namespace Altairis.API.Services;

public interface IBookingService
{
    Task<PagedResult<BookingDto>> GetAllAsync(BookingQueryParams queryParams);
    Task<BookingDto?> GetByIdAsync(int id);
    Task<BookingDto> CreateAsync(CreateBookingDto dto);
    Task<BookingDto?> UpdateStatusAsync(int id, BookingStatus status);
}
