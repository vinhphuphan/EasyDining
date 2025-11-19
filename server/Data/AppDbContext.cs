using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Entities.OrderAggregate;

namespace server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // DECIMAL precision
        modelBuilder.Entity<MenuItem>().Property(m => m.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.Subtotal).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.Discount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.Price).HasColumnType("decimal(18,2)");

        // ENUM → STRING
        modelBuilder.Entity<Table>().Property(t => t.Status).HasConversion<string>();
        modelBuilder.Entity<Order>().Property(o => o.OrderStatus).HasConversion<string>();

        // DEFAULT values
        modelBuilder.Entity<Order>()
            .Property(o => o.OrderType)
            .HasDefaultValue("Dine In");

        // Relationships
        modelBuilder.Entity<Order>()
            .HasMany(o => o.OrderItems)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateAuditFields();
        return base.SaveChanges();
    }

    private void UpdateAuditFields()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                    break;

                case EntityState.Modified:
                    entry.Property(p => p.CreatedAt).IsModified = false;

                    entry.Entity.UpdatedAt = now;
                    break;
            }
        }
    }
}
