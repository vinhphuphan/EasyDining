using Microsoft.EntityFrameworkCore;

namespace server.Entities.OrderAggregate;

[Owned]
public class MenuItemOrdered
{
    public int MenuItemId { get; set; }
    public required string Name { get; set; }
    public required string ImageUrl { get; set; }
}
