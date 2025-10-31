using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Entities.OrderAggregate;

namespace server.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Decimal precision
        modelBuilder.Entity<MenuItem>().Property(m => m.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.Subtotal).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.Discount).HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Table>().Property(t => t.Status).HasConversion<string>();
        modelBuilder.Entity<Order>().Property(t => t.OrderStatus).HasConversion<string>();

        modelBuilder.Entity<Order>()
                    .HasMany(o => o.OrderItems)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
    }
}
