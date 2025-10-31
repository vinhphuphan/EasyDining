using System;

namespace server.Entities.OrderAggregate;

public class Order : BaseEntity
{
    public required string TableCode { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public List<OrderItem> OrderItems { get; set; } = [];
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public decimal GetTotal() => Subtotal - Discount;
}
