using System;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Order;

public class CreateOrderRequest
{
    [Required]
    public string TableCode { get; set; } = string.Empty;

    public string BuyerName { get; set; } = string.Empty;

    [EmailAddress]
    public string? BuyerEmail { get; set; }

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