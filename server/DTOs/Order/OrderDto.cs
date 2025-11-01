namespace server.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }
    public string TableCode { get; set; } = string.Empty;
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal OrderTotal { get; set; }
    public string OrderStatus { get; set; } = string.Empty;
}
