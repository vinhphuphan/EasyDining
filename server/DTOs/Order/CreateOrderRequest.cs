using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Order;

public class CreateOrderRequest
{
    public string TableCode { get; set; } = string.Empty;
    public string OrderType { get; set; } = string.Empty;
    public int NumberOfPeople { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string? BuyerEmail { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Discount { get; set; } = 0m;

    [Required, MinLength(1)]
    public List<CreateOrderItemRequest> Items { get; set; } = [];
}

public class CreateOrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int MenuItemId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    public string? Note { get; set; } = string.Empty;
}
