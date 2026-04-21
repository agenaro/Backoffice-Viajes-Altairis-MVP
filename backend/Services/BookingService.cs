using Altairis.API.DTOs.Booking;
using Altairis.API.DTOs.Common;
using Altairis.API.Models;
using Altairis.API.Repositories;

namespace Altairis.API.Services;

public class BookingService(IBookingRepository repo) : IBookingService
{
    public async Task<PagedResult<BookingDto>> GetAllAsync(BookingQueryParams queryParams)
    {
        var result = await repo.GetAllAsync(queryParams);
        return new PagedResult<BookingDto>
        {
            Items = result.Items.Select(ToDto),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var b = await repo.GetByIdAsync(id);
        return b is null ? null : ToDto(b);
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        var booking = new Booking
        {
            HotelId = dto.HotelId, RoomTypeId = dto.RoomTypeId,
            GuestName = dto.GuestName, GuestEmail = dto.GuestEmail, GuestPhone = dto.GuestPhone,
            CheckIn = dto.CheckIn.Date, CheckOut = dto.CheckOut.Date,
            Rooms = dto.Rooms, TotalPrice = dto.TotalPrice, Notes = dto.Notes
        };
        var created = await repo.CreateAsync(booking);
        var full = await repo.GetByIdAsync(created.Id);
        return ToDto(full!);
    }

    public async Task<BookingDto?> UpdateStatusAsync(int id, BookingStatus status)
    {
        var updated = await repo.UpdateStatusAsync(id, status);
        if (updated is null) return null;
        var full = await repo.GetByIdAsync(updated.Id);
        return ToDto(full!);
    }

    private static BookingDto ToDto(Booking b) => new()
    {
        Id = b.Id,
        HotelId = b.HotelId, HotelName = b.Hotel?.Name ?? string.Empty, HotelCity = b.Hotel?.City ?? string.Empty,
        RoomTypeId = b.RoomTypeId, RoomTypeName = b.RoomType?.Name ?? string.Empty,
        GuestName = b.GuestName, GuestEmail = b.GuestEmail, GuestPhone = b.GuestPhone,
        CheckIn = b.CheckIn, CheckOut = b.CheckOut,
        Rooms = b.Rooms, TotalPrice = b.TotalPrice,
        Status = b.Status.ToString(), Notes = b.Notes, CreatedAt = b.CreatedAt
    };
}
