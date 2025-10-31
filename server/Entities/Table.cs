using System.Text.Json.Serialization;

namespace server.Entities;

public class Table : BaseEntity
{
    public string Name { get; set; } = string.Empty; // Ex: A12, B1, B2, etc.
    public TableStatus Status { get; set; } = TableStatus.Available; // Available, Occupied, Reserved
    public string HashCode { get; private set; } = Guid.NewGuid().ToString("N");
    public int Seats { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TableStatus
{
    Available,
    Occupied,
}