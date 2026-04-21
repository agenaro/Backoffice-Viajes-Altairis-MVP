using Altairis.API.DTOs.RoomType;
using Altairis.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Altairis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomTypesController(IRoomTypeService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetByHotel([FromQuery] int hotelId) =>
        Ok(await service.GetByHotelIdAsync(hotelId));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var rt = await service.GetByIdAsync(id);
        return rt is null ? NotFound() : Ok(rt);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRoomTypeDto dto)
    {
        var rt = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = rt.Id }, rt);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomTypeDto dto)
    {
        var rt = await service.UpdateAsync(id, dto);
        return rt is null ? NotFound() : Ok(rt);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
