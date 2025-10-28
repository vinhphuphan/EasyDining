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
        // Create or update database
        context.Database.Migrate();

        // ===== MenuItems =====
        if (!context.MenuItems.Any())
        {
            var menuItems = new List<MenuItem>
                {
                    new() {
            Name = "Butter Chicken",
            Category = "Chef Recommendation",
            Price = 12.64m,
            Description = "Creamy butter chicken with spices, served with rice.",
            ImageUrl = "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
            IsBest = true
        },
        new() {
            Name = "Wagyu Steak",
            Category = "Chef Recommendation",
            Price = 31.17m,
            Description = "Savor our Wagyu Steak, rich in flavor and buttery texture.",
            ImageUrl = "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
            IsBest = true
        },
        new() {
            Name = "Pasta Bolognese",
            Category = "Chef Recommendation",
            Price = 23.5m,
            Description = "Delicious Pasta Bolognese made with fresh tomatoes, beef, and herbs.",
            ImageUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
            IsBest = true
        },
        new() {
            Name = "Lemon Butter Dory",
            Category = "Chef Recommendation",
            Price = 50.5m,
            Description = "Zesty lemon butter sauce enhances the dory's rich flavor.",
            ImageUrl = "https://i.ytimg.com/vi/JhBqY1Z2Jb4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA9cQb65y87bVmiRxFhDB9cGAG_og",
            IsBest = true
        },
        new() {
            Name = "Spicy Tuna Nachos",
            Category = "Chef Recommendation",
            Price = 18.99m,
            Description = "Crispy nachos topped with spicy tuna, jalapeños, and avocado.",
            ImageUrl = "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
            IsBest = true,
            IsSpicy = true
        },
        new() {
            Name = "Banana Wrap",
            Category = "Chef Recommendation",
            Price = 25.0m,
            Description = "Delicious banana wrapped in a soft tortilla with honey.",
            ImageUrl = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
            IsBest = true,
            IsVeg = true
        },
        new() {
            Name = "Tom Yum Soup",
            Category = "Soup",
            Price = 8.99m,
            Description = "Spicy and sour Thai soup with shrimp and mushrooms.",
            ImageUrl = "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
            IsSpicy = true
        },
        new() {
            Name = "Miso Soup",
            Category = "Soup",
            Price = 5.99m,
            Description = "Traditional Japanese soup with tofu and seaweed.",
            ImageUrl = "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
            IsVeg = true
        },
        new() {
            Name = "Pad Thai",
            Category = "Noodle",
            Price = 14.99m,
            Description = "Classic Thai stir-fried noodles with peanuts and lime.",
            ImageUrl = "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop"
        },
        new() {
            Name = "Ramen",
            Category = "Noodle",
            Price = 16.99m,
            Description = "Japanese noodle soup with pork, egg, and vegetables.",
            ImageUrl = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
        },
        new() {
            Name = "Fried Rice with Green Chili",
            Category = "Rice",
            Price = 45.99m,
            Description = "Spicy fried rice with green chili and vegetables.",
            ImageUrl = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
            IsSpicy = true
        },
        new() {
            Name = "Chicken Biryani",
            Category = "Rice",
            Price = 18.99m,
            Description = "Aromatic rice dish with spiced chicken and herbs.",
            ImageUrl = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop"
        },
        new() {
            Name = "Chocolate Lava Cake",
            Category = "Dessert",
            Price = 9.99m,
            Description = "Warm chocolate cake with a molten center.",
            ImageUrl = "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
            IsBest = true
        },
        new() {
            Name = "Tiramisu",
            Category = "Dessert",
            Price = 11.99m,
            Description = "Classic Italian dessert with coffee and mascarpone.",
            ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
            IsBest = true
        },
        new() {
            Name = "Mango Smoothie",
            Category = "Drink",
            Price = 6.99m,
            Description = "Refreshing mango smoothie with ice.",
            ImageUrl = "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
            IsVeg = true
        },
        new() {
            Name = "Jar Fruit Iced Tea",
            Category = "Drink",
            Price = 8.0m,
            Description = "Refreshing iced tea with mixed fruits.",
            ImageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
            IsVeg = true
        },
        new() {
            Name = "Hawaiian Chicken Skewers",
            Category = "Main Course",
            Price = 16.99m,
            Description = "",
            ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShoNVuXZR8YNIuymib6hnUUvfGAC0lb_xiwA&s"
        },
        new() {
            Name = "BBQ Beef Ribs",
            Category = "Main Course",
            Price = 24.99m,
            Description = "",
            ImageUrl = "https://www.foodandwine.com/thmb/3vphgXNFQ1yI_Qv7b2pFXJYw5zo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/200609-r-xl-sticky-barbecued-beef-ribs-2000-7f29a1d0eeed49159a7cc7479d12e700.jpg"
        },
        new() {
            Name = "Veggie Supreme Pizza",
            Category = "Pizza",
            Price = 18.99m,
            Description = "",
            ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaOd-yzw835koYdEr8v0ecT5lvreJgMrz76g&s",
            IsVeg = true,
            IsBest = true
        },
        new() {
            Name = "Tacos With Chicken Grilled",
            Category = "Mexican",
            Price = 14.99m,
            Description = "",
            ImageUrl = "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FEdit%2F2022-08-Grilled-Chicken-Tacos%2FGrilled_Chicken_Tacos-3"
        }
        };
            context.MenuItems.AddRange(menuItems);
            context.SaveChanges();
        }

        // // ===== Employees =====
        // if (!context.Employees.Any())
        // {
        //     var employees = new List<Employee>
        // {
        //     new() {
        //         Name = "Richardo Wilson",
        //         Email = "richardo.wilson@gmail.com",
        //         PinCode = "123456",
        //         Role = "Waiter",
        //         Avatar = "https://raw.githubusercontent.com/vinhphuphan/EasyDining/refs/heads/main/client/Restaurant-Dashboard/public/professional-man.jpg",
        //         ShiftStart =TimeSpan.Parse("10:00:00"),
        //         ShiftEnd = TimeSpan.Parse("14:00:00")
        //         },
        //     new() {
        //         Name = "Orlando",
        //         Email = "orlando@easydining.com",
        //         PinCode = "234567",
        //         Role = "Waiter",
        //         Avatar = "https://raw.githubusercontent.com/vinhphuphan/EasyDining/refs/heads/main/client/Restaurant-Dashboard/public/young-waiter.jpg", ShiftStart = TimeSpan.Parse("14:00:00"), ShiftEnd = TimeSpan.Parse("18:00:00")
        //         },
        //     new() {
        //         Name = "Eve",
        //         Email = "eve@easydining.com",
        //         PinCode = "345678",
        //         Role = "Waiter",
        //         Avatar = "https://raw.githubusercontent.com/vinhphuphan/EasyDining/refs/heads/main/client/Restaurant-Dashboard/public/user-03.jpg", ShiftStart = TimeSpan.Parse("18:00:00"), ShiftEnd = TimeSpan.Parse("22:00:00")
        //         }
        //     };
        //     context.Employees.AddRange(employees);
        //     context.SaveChanges();
        // }

        // ===== Tables =====
        if (!context.Tables.Any())
        {
            context.Tables.AddRange(
                new Table { Name = "A1", Seats = 4, Status = TableStatus.Available },
                new Table { Name = "A2", Seats = 2, Status = TableStatus.Reserved },
                new Table { Name = "A3", Seats = 2, Status = TableStatus.Occupied },
                new Table { Name = "A4", Seats = 2, Status = TableStatus.Available },
                new Table { Name = "A5", Seats = 2, Status = TableStatus.Available },
                new Table { Name = "B1", Seats = 6, Status = TableStatus.Occupied }
            );
            context.SaveChanges();
        }
    }
}
