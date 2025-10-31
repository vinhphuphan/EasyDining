using System;

namespace server.Entities.OrderAggregate;

public class OrderItem
{
    public int Id { get; set; }
    public required MenuItemOrdered ItemOrdered { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; } = string.Empty;
}
