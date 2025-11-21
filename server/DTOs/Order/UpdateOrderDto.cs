namespace server.DTOs.Order;

public class UpdateOrderDto
{
    public string BuyerName { get; set; } = "";
    public string BuyerEmail { get; set; } = "";
    public string BuyerNote { get; set; } = "";
    public string TableCode { get; set; } = "";
    public string OrderType { get; set; } = string.Empty;
    public int? NumberOfPeople { get; set; }
}
