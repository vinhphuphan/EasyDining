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

        // Nếu đã có dữ liệu rồi thì bỏ qua
        if (context.MenuItems.Any()) return;

        var menuItems = new List<MenuItem>
        {
            // ==== BBQ COMBO ====
            new() { Name = "Premium Wagyu & Pork Family Set 1000g", Category = "BBQ Combo", Price = 175.00m, Description = "8 Side Dishes, sauces, soup, lettuce (4–5 ppl)", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745413184956tb_%EB%B9%85%EC%85%8B.png?alt=media&token=920d5206-8291-443e-9027-5c99f8bf364a" },
            new() { Name = "Premium Wagyu & Pork Couple Set 600g", Category = "BBQ Combo", Price = 135.00m, Description = "8 Side Dishes, sauces, soup, lettuce (2–3 ppl)" , ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745413155298tb_%EC%99%80%EA%B7%9C%ED%8F%AD%EC%83%9B.png?alt=media&token=40a58179-8b6d-458b-b265-c0a7feb16575"},
            new() { Name = "Marinated Beef, Pork & Chicken Set 700g", Category = "BBQ Combo", Price = 130.00m, Description = "8 Side Dishes, sauces, soup, lettuce (2–3 ppl)", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745413002789tb_%EC%96%91%EB%85%90%20%EC%85%8B.png?alt=media&token=ac6dfc39-8d70-4107-895c-1ab38a9f8bcd" },
            new() { Name = "Premium Wagyu Set 500g", Category = "BBQ Combo", Price = 125.00m, Description = "8 Side Dishes, sauces, soup, lettuce (2–3 ppl)", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412986101tb_%EC%99%80%EA%B7%9C%202%EC%9D%B8.png?alt=media&token=06bf702a-9200-423b-acc1-52ba5d7794ab" },

            // ==== BBQ ====
            new() { Name = "Wagyu Chuck Tail Flap 160g", Category = "BBQ", Price = 46.00m, Description = "Served with 8 Side Dishes, dipping sauce, lettuce", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412690398tb_%EC%82%B4%EC%B9%98.png?alt=media&token=dc1f2e49-24d3-4c51-a1d6-4d50d6326a4b" },
            new() { Name = "Wagyu Oyster Blade 160g", Category = "BBQ", Price = 45.00m, Description = "Served with 8 Side Dishes, dipping sauce, lettuce", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412674504tb_%EB%B6%80%EC%B1%84.png?alt=media&token=ea57e8f9-cab5-4f28-820a-2f67f2be9473" },
            new() { Name = "Wagyu Chuck Rib Meat 160g", Category = "BBQ", Price = 45.00m, Description = "Served with 8 Side Dishes, dipping sauce, lettuce", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412519132tb_%EB%8A%91%EA%B0%84.png?alt=media&token=2f1e7530-347f-44bc-bd60-ddfb7b898663" },
            new() { Name = "Marinated Pork Neck 200g", Category = "BBQ", Price = 28.00m, Description = "Served with 8 Side Dishes, dipping sauce, lettuce", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412519132tb_%EB%8A%91%EA%B0%84.png?alt=media&token=2f1e7530-347f-44bc-bd60-ddfb7b898663" },

            // ==== SOUP ====
            new() { Name = "Beef Rib Soup (Galbitang)", Category = "Soup", Price = 28.00m, Description = "Served with rice, kimchi, clear noodles", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412005765tb_%EA%B0%88%EB%B9%84%ED%83%95.png?alt=media&token=a33bb57c-e022-4a89-9386-58f83a2f217d" },
            new() { Name = "Spicy Beef Soup (Yukgaejang)", Category = "Soup", Price = 24.00m, Description = "Served with rice, kimchi, clear noodles", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745411953691tb_%EC%9C%A1%EA%B3%84%EC%9E%A5.png?alt=media&token=fcc28a86-758f-42c5-96b7-006f4f999765" },
            new() { Name = "Kimchi Soup with Pork", Category = "Soup", Price = 24.00m, Description = "Served with rice, kimchi, clear noodles", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745411906111tb_%EA%B9%80%EC%B9%98%EC%B0%8C%EA%B0%9C.png?alt=media&token=3cdbaf9d-2397-49ff-8f5b-b26a263bd03a" },
            new() { Name = "Soft Tofu Soup", Category = "Soup", Price = 24.00m, Description = "Served with rice, kimchi, clear noodles", ImageUrl="https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745411906111tb_%EA%B9%80%EC%B9%98%EC%B0%8C%EA%B0%9C.png?alt=media&token=3cdbaf9d-2397-49ff-8f5b-b26a263bd03a" },

            // ==== Hotpot ====
            new() {
                    Name = "Braised Short Rib",
                    Price = 68.00m,
                    Description = "Tender short ribs braised in a savory-sweet soy-based sauce. Comes with 2 servings of rice.",
                    ImageUrl = "https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745412971608tb_%EA%B0%88%EB%B9%84%EC%B0%9C.png?alt=media&token=68de550e-8619-48c5-9e23-f24ff5ec17cb",
                    Category = "Hotpot"
                },
            new() {
                    Name = "Beef & Mushroom Stew",
                    Price = 50.00m,
                    Description = "Beef and mushrooms simmered in rich broth. Comes with 2 servings of rice.",
                    ImageUrl = "https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745407194244tb_1668817126327t_h_%EB%B6%88%EA%B3%A0%EA%B8%B0%EB%B2%84%EC%84%AF%EC%A0%84%EA%B3%A8.jpg?alt=media&token=b1133df0-931e-4982-871d-9c7a587b3000",
                    Category = "Hotpot"
                },
                new() {
                    Name = "Braised Spicy Pork",
                    Price = 50.00m,
                    Description = "Spicy braised pork stew with rich Korean seasoning. Comes with 2 servings of rice.",
                    ImageUrl = "https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745407208617tb_1668816821242t_h_%EC%A7%9C%EA%B8%80%EC%9D%B4.jpg?alt=media&token=5203cb35-a7c6-4655-abb5-374cc74e9c67",
                    Category = "Hotpot"
                },
                new() {
                    Name = "Spicy Pork & Kimchi Stew",
                    Price = 50.00m,
                    Description = "Classic spicy stew with pork and kimchi. Comes with 2 servings of rice.",
                    ImageUrl = "https://firebasestorage.googleapis.com/v0/b/order-now-aus.appspot.com/o/menu%2F1745407219123tb_1668816649332t_h_%EB%8F%BC%EC%A7%80%EA%B9%80%EC%B9%98%EC%B0%9C.jpg?alt=media&token=18ad35cf-3fe3-4006-b9b2-30235a094906",
                    Category = "Hotpot"
                }
        };

        context.MenuItems.AddRange(menuItems);
        context.SaveChanges();
    }
}
