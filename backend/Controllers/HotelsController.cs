using Altairis.API.DTOs.Hotel;
using Altairis.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Altairis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelsController(IHotelService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] HotelQueryParams queryParams) =>
        Ok(await service.GetAllAsync(queryParams));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var hotel = await service.GetByIdAsync(id);
        return hotel is null ? NotFound() : Ok(hotel);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHotelDto dto)
    {
        var hotel = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, hotel);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateHotelDto dto)
    {
        var hotel = await service.UpdateAsync(id, dto);
        return hotel is null ? NotFound() : Ok(hotel);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
