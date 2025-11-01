using server.DTOs.Order;
using server.Entities.OrderAggregate;

namespace server.Helpers;

public static class OrderHelpers
{
    public static OrderDto ToDto(this Order o)
    {
        return new()
        {
            Id = o.Id,
            TableCode = o.TableCode,
            BuyerName = o.BuyerName,
            BuyerEmail = o.BuyerEmail,
            OrderStatus = o.OrderStatus.ToString(),
            Subtotal = o.Subtotal,
            OrderDate = o.OrderDate,
            OrderTotal = o.GetTotal(),
            Items = [.. o.OrderItems.Select(
                oi => new OrderItemDto
                {
                    Id = oi.ItemOrdered.MenuItemId,
                    Name = oi.ItemOrdered.Name,
                    ImageUrl = oi.ItemOrdered.ImageUrl,
                    Price = oi.Price,
                    Quantity = oi.Quantity,
                    Note = oi.Note
                })
            ]
        };
    }

    public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query)
    {
        return query.Select(o => new OrderDto
        {
            Id = o.Id,
            TableCode = o.TableCode,
            BuyerName = o.BuyerName,
            BuyerEmail = o.BuyerEmail,
            OrderStatus = o.OrderStatus.ToString(),
            Subtotal = o.Subtotal,
            OrderDate = o.OrderDate,
            Items = o.OrderItems.Select(oi => new OrderItemDto { Name = oi.ItemOrdered.Name, ImageUrl = oi.ItemOrdered.ImageUrl, Price = oi.Price, Quantity = oi.Quantity, Note = oi.Note }).ToList()
        });
    }
}
