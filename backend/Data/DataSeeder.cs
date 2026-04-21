using Altairis.API.Models;

namespace Altairis.API.Data;

public static class DataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Hotels.Any()) return;

        var hotels = new List<Hotel>
        {
            new() { Name = "Hotel Arts Barcelona", Stars = 5, Address = "Carrer de la Marina, 19-21", City = "Barcelona", Country = "España", Phone = "+34 932 211 000", Email = "info@hotelartsbarcelona.com", Description = "Hotel de lujo frente al mar Mediterráneo" },
            new() { Name = "Marriott Madrid Auditorium", Stars = 4, Address = "Av. de Aragón, 400", City = "Madrid", Country = "España", Phone = "+34 914 007 700", Email = "info@marriottmadrid.com", Description = "Hotel de referencia junto al aeropuerto y IFEMA" },
            new() { Name = "NH Collection Milan", Stars = 4, Address = "Via Cusani 13", City = "Milán", Country = "Italia", Phone = "+39 02 851 567", Email = "nhcollectionmilan@nh-hotels.com", Description = "Hotel boutique en el corazón histórico de Milán" },
            new() { Name = "Radisson Blu Paris Boulogne", Stars = 4, Address = "1 Rue Marcel Dassault", City = "París", Country = "Francia", Phone = "+33 1 46 99 70 00", Email = "info.paris@radissonblu.com", Description = "Hotel moderno a orillas del Sena" },
            new() { Name = "Hilton London Metropole", Stars = 4, Address = "225 Edgware Rd", City = "Londres", Country = "Reino Unido", Phone = "+44 20 7402 4141", Email = "london.metropole@hilton.com", Description = "Gran hotel en el corazón del West End londinense" },
            new() { Name = "Meliá Sevilla", Stars = 4, Address = "Dr. Pedro de Castro, 1", City = "Sevilla", Country = "España", Phone = "+34 954 421 511", Email = "melia.sevilla@melia.com", Description = "Hotel emblemático frente a la Torre del Oro" },
            new() { Name = "Grand Hotel Villa Medici", Stars = 5, Address = "Via Il Prato, 42", City = "Florencia", Country = "Italia", Phone = "+39 055 238 1331", Email = "info@villamedici.com", Description = "Palacete del siglo XVIII reconvertido en hotel de lujo" },
        };

        db.Hotels.AddRange(hotels);
        db.SaveChanges();

        var roomTypes = new List<RoomType>();
        var roomTypeNames = new[] { "Habitación Individual", "Habitación Doble", "Suite Junior", "Suite Ejecutiva" };
        var occupancies = new[] { 1, 2, 2, 2 };
        var basePrices = new[] { 80m, 120m, 200m, 350m };
        var totalRooms = new[] { 30, 50, 15, 5 };

        foreach (var hotel in hotels)
        {
            for (int i = 0; i < 3; i++)
            {
                roomTypes.Add(new RoomType
                {
                    HotelId = hotel.Id,
                    Name = roomTypeNames[i],
                    Description = $"{roomTypeNames[i]} con todas las comodidades",
                    MaxOccupancy = occupancies[i],
                    BasePrice = basePrices[i] * (hotel.Stars == 5 ? 1.5m : 1.0m),
                    TotalRooms = totalRooms[i]
                });
            }
        }

        db.RoomTypes.AddRange(roomTypes);
        db.SaveChanges();

        var rng = new Random(42);
        var availabilities = new List<Availability>();
        var today = DateTime.UtcNow.Date;

        foreach (var rt in roomTypes)
        {
            for (int d = -7; d < 60; d++)
            {
                var available = rt.TotalRooms - rng.Next(0, rt.TotalRooms / 2 + 1);
                availabilities.Add(new Availability
                {
                    RoomTypeId = rt.Id,
                    Date = today.AddDays(d),
                    AvailableRooms = available,
                    Price = rt.BasePrice * (decimal)(0.9 + rng.NextDouble() * 0.3)
                });
            }
        }

        db.Availabilities.AddRange(availabilities);
        db.SaveChanges();

        var guestNames = new[] { "Carlos García", "María López", "John Smith", "Emma Wilson", "Pierre Dubois", "Anna Rossi", "Miguel Fernández", "Laura Martínez", "Thomas Brown", "Sophie Martin", "David Johnson", "Isabel Costa", "Marco Ferrari", "Clara Müller", "James Anderson" };
        var statuses = new[] { BookingStatus.Confirmed, BookingStatus.Confirmed, BookingStatus.Confirmed, BookingStatus.CheckedIn, BookingStatus.CheckedOut, BookingStatus.Cancelled, BookingStatus.Pending };

        var bookings = new List<Booking>();
        for (int i = 0; i < 25; i++)
        {
            var hotel = hotels[rng.Next(hotels.Count)];
            var hotelRooms = roomTypes.Where(rt => rt.HotelId == hotel.Id).ToList();
            var roomType = hotelRooms[rng.Next(hotelRooms.Count)];
            var checkIn = today.AddDays(rng.Next(-15, 30));
            var nights = rng.Next(1, 7);
            var rooms = rng.Next(1, 3);
            var guestName = guestNames[i % guestNames.Length];

            bookings.Add(new Booking
            {
                HotelId = hotel.Id,
                RoomTypeId = roomType.Id,
                GuestName = guestName,
                GuestEmail = guestName.ToLower().Replace(" ", ".") + "@email.com",
                GuestPhone = "+34 6" + rng.Next(10000000, 99999999),
                CheckIn = checkIn,
                CheckOut = checkIn.AddDays(nights),
                Rooms = rooms,
                TotalPrice = roomType.BasePrice * nights * rooms,
                Status = statuses[rng.Next(statuses.Length)],
                CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(0, 30))
            });
        }

        db.Bookings.AddRange(bookings);
        db.SaveChanges();
    }
}
