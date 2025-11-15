using server.Entities.OrderAggregate;

namespace server.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }
    public int? TableId { get; set; }
    public string TableCode { get; set; } = string.Empty;
    public string? TableName { get; set; }
    public string OrderType { get; set; } = string.Empty;
    public int? NumberOfPeople { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal OrderTotal { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public string OrderStatusText => OrderStatus.ToString();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
