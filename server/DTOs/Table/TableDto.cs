using server.DTOs.Order;

namespace server.DTOs.Table;

public class TableDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TableCode { get; set; } = string.Empty;
    public int Seats { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<OrderDto> Orders { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
