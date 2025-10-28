using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Decimal precision
        modelBuilder.Entity<MenuItem>().Property(m => m.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Table>().Property(t => t.Status).HasConversion<string>();
    }
}
