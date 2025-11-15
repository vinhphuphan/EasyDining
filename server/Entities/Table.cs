using System.Text.Json.Serialization;
using server.Entities.OrderAggregate;
using server.Helpers;

namespace server.Entities;

public class Table : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public TableStatus Status { get; set; } = TableStatus.Available;
    public string TableCode { get; private set; } = TableCodeGenerator.Generate();
    public int Seats { get; set; }
    public List<Order> Orders { get; set; } = [];
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TableStatus
{
    Available,
    Occupied,
}