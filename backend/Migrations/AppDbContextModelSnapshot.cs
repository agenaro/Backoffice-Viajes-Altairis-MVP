using System;
using Altairis.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Altairis.API.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("Altairis.API.Models.Availability", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("int");
                MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));
                b.Property<int>("AvailableRooms").HasColumnType("int");
                b.Property<DateTime>("Date").HasColumnType("datetime(6)");
                b.Property<decimal>("Price").HasColumnType("decimal(10,2)");
                b.Property<int>("RoomTypeId").HasColumnType("int");
                b.HasKey("Id");
                b.HasIndex("RoomTypeId", "Date").IsUnique();
                b.ToTable("Availabilities");
            });

            modelBuilder.Entity("Altairis.API.Models.Booking", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("int");
                MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));
                b.Property<DateTime>("CheckIn").HasColumnType("datetime(6)");
                b.Property<DateTime>("CheckOut").HasColumnType("datetime(6)");
                b.Property<DateTime>("CreatedAt").HasColumnType("datetime(6)");
                b.Property<string>("GuestEmail").IsRequired().HasMaxLength(200).HasColumnType("varchar(200)");
                b.Property<string>("GuestName").IsRequired().HasMaxLength(200).HasColumnType("varchar(200)");
                b.Property<string>("GuestPhone").HasColumnType("longtext");
                b.Property<int>("HotelId").HasColumnType("int");
                b.Property<string>("Notes").HasColumnType("longtext");
                b.Property<int>("Rooms").HasColumnType("int");
                b.Property<int>("RoomTypeId").HasColumnType("int");
                b.Property<string>("Status").IsRequired().HasColumnType("longtext");
                b.Property<decimal>("TotalPrice").HasColumnType("decimal(10,2)");
                b.HasKey("Id");
                b.HasIndex("HotelId");
                b.HasIndex("RoomTypeId");
                b.ToTable("Bookings");
            });

            modelBuilder.Entity("Altairis.API.Models.Hotel", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("int");
                MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));
                b.Property<string>("Address").IsRequired().HasMaxLength(500).HasColumnType("varchar(500)");
                b.Property<string>("City").IsRequired().HasMaxLength(100).HasColumnType("varchar(100)");
                b.Property<string>("Country").IsRequired().HasMaxLength(100).HasColumnType("varchar(100)");
                b.Property<DateTime>("CreatedAt").HasColumnType("datetime(6)");
                b.Property<string>("Description").HasColumnType("longtext");
                b.Property<string>("Email").HasColumnType("longtext");
                b.Property<bool>("IsActive").HasColumnType("tinyint(1)");
                b.Property<string>("Name").IsRequired().HasMaxLength(200).HasColumnType("varchar(200)");
                b.Property<string>("Phone").HasColumnType("longtext");
                b.Property<int>("Stars").HasColumnType("int");
                b.HasKey("Id");
                b.ToTable("Hotels");
            });

            modelBuilder.Entity("Altairis.API.Models.RoomType", b =>
            {
                b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("int");
                MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));
                b.Property<decimal>("BasePrice").HasColumnType("decimal(10,2)");
                b.Property<string>("Description").HasColumnType("longtext");
                b.Property<int>("HotelId").HasColumnType("int");
                b.Property<int>("MaxOccupancy").HasColumnType("int");
                b.Property<string>("Name").IsRequired().HasMaxLength(100).HasColumnType("varchar(100)");
                b.Property<int>("TotalRooms").HasColumnType("int");
                b.HasKey("Id");
                b.HasIndex("HotelId");
                b.ToTable("RoomTypes");
            });

            modelBuilder.Entity("Altairis.API.Models.Availability", b =>
            {
                b.HasOne("Altairis.API.Models.RoomType", "RoomType")
                    .WithMany("Availabilities").HasForeignKey("RoomTypeId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("RoomType");
            });

            modelBuilder.Entity("Altairis.API.Models.Booking", b =>
            {
                b.HasOne("Altairis.API.Models.Hotel", "Hotel")
                    .WithMany("Bookings").HasForeignKey("HotelId").OnDelete(DeleteBehavior.Restrict).IsRequired();
                b.HasOne("Altairis.API.Models.RoomType", "RoomType")
                    .WithMany("Bookings").HasForeignKey("RoomTypeId").OnDelete(DeleteBehavior.Restrict).IsRequired();
                b.Navigation("Hotel");
                b.Navigation("RoomType");
            });

            modelBuilder.Entity("Altairis.API.Models.RoomType", b =>
            {
                b.HasOne("Altairis.API.Models.Hotel", "Hotel")
                    .WithMany("RoomTypes").HasForeignKey("HotelId").OnDelete(DeleteBehavior.Cascade).IsRequired();
                b.Navigation("Hotel");
            });

            modelBuilder.Entity("Altairis.API.Models.Hotel", b =>
            {
                b.Navigation("Bookings");
                b.Navigation("RoomTypes");
            });

            modelBuilder.Entity("Altairis.API.Models.RoomType", b =>
            {
                b.Navigation("Availabilities");
                b.Navigation("Bookings");
            });
#pragma warning restore 612, 618
        }
    }
}
