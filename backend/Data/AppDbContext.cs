using Altairis.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<RoomType> RoomTypes => Set<RoomType>();
    public DbSet<Availability> Availabilities => Set<Availability>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hotel>(e =>
        {
            e.HasKey(h => h.Id);
            e.Property(h => h.Name).HasMaxLength(200).IsRequired();
            e.Property(h => h.Address).HasMaxLength(500);
            e.Property(h => h.City).HasMaxLength(100);
            e.Property(h => h.Country).HasMaxLength(100);
            e.HasMany(h => h.RoomTypes).WithOne(r => r.Hotel).HasForeignKey(r => r.HotelId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(h => h.Bookings).WithOne(b => b.Hotel).HasForeignKey(b => b.HotelId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RoomType>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Name).HasMaxLength(100).IsRequired();
            e.Property(r => r.BasePrice).HasColumnType("decimal(10,2)");
            e.HasMany(r => r.Availabilities).WithOne(a => a.RoomType).HasForeignKey(a => a.RoomTypeId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(r => r.Bookings).WithOne(b => b.RoomType).HasForeignKey(b => b.RoomTypeId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Availability>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.Price).HasColumnType("decimal(10,2)");
            e.HasIndex(a => new { a.RoomTypeId, a.Date }).IsUnique();
        });

        modelBuilder.Entity<Booking>(e =>
        {
            e.HasKey(b => b.Id);
            e.Property(b => b.GuestName).HasMaxLength(200).IsRequired();
            e.Property(b => b.GuestEmail).HasMaxLength(200).IsRequired();
            e.Property(b => b.TotalPrice).HasColumnType("decimal(10,2)");
            e.Property(b => b.Status).HasConversion<string>();
        });
    }
}
