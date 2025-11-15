namespace server.DTOs.Table;

public class TableCheckoutDto
{
    public int TableId { get; set; }
    public string TableName { get; set; } = string.Empty;
    public string TableCode { get; set; } = string.Empty;
    public int OrdersCount { get; set; }
    public IReadOnlyList<OrderSummaryItemDto> Orders { get; set; } = [];
    public decimal TotalAmount { get; set; }
    public DateTime CheckoutTimeUtc { get; set; }
}

public class OrderSummaryItemDto
{
    public int OrderId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
}

