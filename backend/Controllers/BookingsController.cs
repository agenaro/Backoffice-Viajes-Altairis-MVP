using Altairis.API.DTOs.Booking;
using Altairis.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Altairis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController(IBookingService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] BookingQueryParams queryParams) =>
        Ok(await service.GetAllAsync(queryParams));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await service.GetByIdAsync(id);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        try
        {
            var booking = await service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var booking = await service.UpdateStatusAsync(id, dto.Status);
        return booking is null ? NotFound() : Ok(booking);
    }
}
