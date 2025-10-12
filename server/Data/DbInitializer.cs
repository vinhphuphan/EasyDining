using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>()
            ?? throw new InvalidOperationException("Failed to retrieve AppDbContext");

        SeedData(context);
    }

    private static void SeedData(AppDbContext context)
    {
        // Tạo hoặc update database
        context.Database.Migrate();

        // ===== MenuItems =====
        if (!context.MenuItems.Any())
        {
            var menuItems = new List<MenuItem>
        {
            new() { Name = "Butter Chicken", Category = "Chef Recommendation", Price = 12.64m, Description = "Creamy butter chicken with spices, served with rice.", ImageUrl = "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
            new() { Name = "Wagyu Steak", Category = "Chef Recommendation", Price = 31.17m, Description = "Savor our Wagyu Steak, rich in flavor and buttery texture.", ImageUrl = "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop" },
            new() { Name = "Pasta Bolognese", Category = "Chef Recommendation", Price = 23.5m, Description = "Delicious Pasta Bolognese made with fresh tomatoes, beef, and herbs.", ImageUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
            new() { Name = "Lemon Butter Dory", Category = "Chef Recommendation", Price = 50.5m, Description = "Zesty lemon butter sauce enhances the dory's rich flavor.", ImageUrl = "https://i.ytimg.com/vi/JhBqY1Z2Jb4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA9cQb65y87bVmiRxFhDB9cGAG_og" },
            new() { Name = "Spicy Tuna Nachos", Category = "Chef Recommendation", Price = 18.99m, Description = "Crispy nachos topped with spicy tuna, jalapeños, and avocado.", ImageUrl = "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop" },
            new() { Name = "Banana Wrap", Category = "Chef Recommendation", Price = 25.0m, Description = "Delicious banana wrapped in a soft tortilla with honey.", ImageUrl = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop" },
            new() { Name = "Tom Yum Soup", Category = "Soup", Price = 8.99m, Description = "Spicy and sour Thai soup with shrimp and mushrooms.", ImageUrl = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop" },
            new() { Name = "Miso Soup", Category = "Soup", Price = 5.99m, Description = "Traditional Japanese soup with tofu and seaweed.", ImageUrl = "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop" },
            new() { Name = "Pad Thai", Category = "Noodle", Price = 14.99m, Description = "Classic Thai stir-fried noodles with peanuts and lime.", ImageUrl = "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop" },
            new() { Name = "Ramen", Category = "Noodle", Price = 16.99m, Description = "Japanese noodle soup with pork, egg, and vegetables.", ImageUrl = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop" },
            new() { Name = "Fried Rice with Green Chili", Category = "Rice", Price = 45.99m, Description = "Spicy fried rice with green chili and vegetables.", ImageUrl = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
            new() { Name = "Chicken Biryani", Category = "Rice", Price = 18.99m, Description = "Aromatic rice dish with spiced chicken and herbs.", ImageUrl = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
            new() { Name = "Chocolate Lava Cake", Category = "Dessert", Price = 9.99m, Description = "Warm chocolate cake with a molten center.", ImageUrl = "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop" },
            new() { Name = "Tiramisu", Category = "Dessert", Price = 11.99m, Description = "Classic Italian dessert with coffee and mascarpone.", ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
            new() { Name = "Mango Smoothie", Category = "Drink", Price = 6.99m, Description = "Refreshing mango smoothie with ice.", ImageUrl = "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop" },
            new() { Name = "Jar Fruit Iced Tea", Category = "Drink", Price = 8.0m, Description = "Refreshing iced tea with mixed fruits.", ImageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
            new() { Name = "Hawaiian Chicken Skewers", Category = "Main Course", Price = 16.99m, Description = "", ImageUrl = "/hawaiian-chicken-skewers.jpg" },
            new() { Name = "BBQ Beef Ribs", Category = "Main Course", Price = 24.99m, Description = "", ImageUrl = "/bbq-beef-ribs.jpg" },
            new() { Name = "Veggie Supreme Pizza", Category = "Pizza", Price = 18.99m, Description = "", ImageUrl = "/veggie-supreme-pizza.jpg" },
            new() { Name = "Tacos With Chicken Grilled", Category = "Mexican", Price = 14.99m, Description = "", ImageUrl = "/chicken-tacos.png" },
        };
            context.MenuItems.AddRange(menuItems);
            context.SaveChanges();
        }

        // ===== Employees =====
        if (!context.Employees.Any())
        {
            var employees = new List<Employee>
        {
            new() { Id = 1, Name = "Richardo Wilson", Email = "richardo.wilson@gmail.com", PinCode = "123456", Role = "Waiter", Avatar = "/professional-man.jpg", ShiftStart =TimeSpan.Parse("10:00:00"), ShiftEnd = TimeSpan.Parse("14:00:00") },
            new() { Id = 2, Name = "Orlando", Email = "orlando@easydining.com", PinCode = "234567", Role = "Waiter", Avatar = "/young-waiter.jpg", ShiftStart = TimeSpan.Parse("14:00:00"), ShiftEnd = TimeSpan.Parse("18:00:00") },
            new() { Id = 3, Name = "Eve", Email = "eve@easydining.com", PinCode = "345678", Role = "Waiter", Avatar = "/user-03.jpg", ShiftStart = TimeSpan.Parse("18:00:00"), ShiftEnd = TimeSpan.Parse("22:00:00") }
        };
            context.Employees.AddRange(employees);
            context.SaveChanges();
        }

        // ===== Tables =====
        if (!context.Tables.Any())
        {
            var tables = new List<Table>
        {
            new() { TableNo = 1, Status = "occupied", Seats = 2 },
            new() { TableNo = 2, Status = "available", Seats = 4 },
            new() { TableNo = 3, Status = "available", Seats = 2 },
            new() { TableNo = 4, Status = "occupied", Seats = 6 },
            new() { TableNo = 5, Status = "available", Seats = 4 },
            new() { TableNo = 6, Status = "available", Seats = 2 },
            new() { TableNo = 7, Status = "available", Seats = 4 },
            new() { TableNo = 8, Status = "available", Seats = 2 },
            new() { TableNo = 15, Status = "available", Seats = 6 },
            new() { TableNo = 11, Status = "occupied", Seats = 4 },
            new() { TableNo = 101, Status = "available", Seats = 4 }, // B1
            new() { TableNo = 102, Status = "available", Seats = 2 }, // B2
            new() { TableNo = 103, Status = "occupied", Seats = 6 }   // B3
        };
            context.Tables.AddRange(tables);
            context.SaveChanges();
        }

        // // ===== Orders =====
        // if (!context.Orders.Any())
        // {
        //     var order1 = new Order { OrderNumber = "DI008", CustomerName = "Daniel", Type = "Dine In", Status = "in-progress", Progress = 10, TotalAmount = 35.96m, CreatedAt = DateTime.Now };
        //     var order2 = new Order { OrderNumber = "TA001", CustomerName = "Vlona", Type = "Take Away", Status = "in-progress", Progress = 60, TotalAmount = 27.98m, CreatedAt = DateTime.Now };

        //     context.Orders.AddRange(order1, order2);
        //     context.SaveChanges(); // save first to generate IDs

        //     var orderItems = new List<OrderItem>
        //     {
        //         new() { OrderId = order1.Id, MenuItemId = 1, Quantity = 2, Price = 12.99m },
        //         new() { OrderId = order1.Id, MenuItemId = 2, Quantity = 2, Price = 4.99m },
        //         new() { OrderId = order2.Id, MenuItemId = 3, Quantity = 1, Price = 18.99m }
        //     };

        //     context.OrderItems.AddRange(orderItems);
        //     context.SaveChanges();
        // }

    }
}
