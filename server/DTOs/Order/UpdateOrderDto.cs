using System;

namespace server.DTOs.Order;

public class UpdateOrderDto
{
    public string BuyerName { get; set; } = "";
    public string BuyerEmail { get; set; } = "";
    public string TableCode { get; set; } = "";
}
