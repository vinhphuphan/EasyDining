using System;

namespace server.DTOs.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int MenuItemId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
}
