using server.Entities;

namespace server.DTOs.Table;

public class UpdateTableDto
{
    public string Name { get; set; } = string.Empty;
    public int Seats { get; set; }
    public TableStatus Status { get; set; } = TableStatus.Available;
}
