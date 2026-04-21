namespace Altairis.API.DTOs.Hotel;

public class HotelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stars { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int RoomTypesCount { get; set; }
}

public class CreateHotelDto
{
    public string Name { get; set; } = string.Empty;
    public int Stars { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Description { get; set; }
}

public class UpdateHotelDto : CreateHotelDto
{
    public bool IsActive { get; set; }
}

public class HotelQueryParams
{
    public string? Search { get; set; }
    public string? Country { get; set; }
    public int? Stars { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = "name";
    public string SortDir { get; set; } = "asc";
}
