using System.Text.Json.Serialization;

namespace server.Entities.OrderAggregate;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrderStatus
{
    Pending,
    Preparing,
    Served,
    Cancelled
}
