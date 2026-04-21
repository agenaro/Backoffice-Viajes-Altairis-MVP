using Altairis.API.DTOs.Availability;
using Altairis.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Altairis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController(IAvailabilityService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] AvailabilityQueryParams queryParams) =>
        Ok(await service.GetAsync(queryParams));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAvailabilityDto dto) =>
        Ok(await service.CreateAsync(dto));

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAvailabilityDto dto)
    {
        var av = await service.UpdateAsync(id, dto);
        return av is null ? NotFound() : Ok(av);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> BulkUpsert([FromBody] BulkAvailabilityDto dto)
    {
        await service.BulkUpsertAsync(dto);
        return Ok();
    }
}
