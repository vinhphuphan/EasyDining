namespace server.Entities;

public class OrderItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Note { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }
}