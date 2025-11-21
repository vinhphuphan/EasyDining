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
            TableId = o.TableId,
            TableCode = o.TableCode,
            OrderType = o.OrderType,
            NumberOfPeople = o.NumberOfPeople,
            BuyerName = o.BuyerName,
            BuyerEmail = o.BuyerEmail,
            BuyerNote = o.BuyerNote,
            OrderStatus = o.OrderStatus,
            CreatedAt = o.CreatedAt,
            UpdatedAt = o.UpdatedAt,
            Subtotal = o.Subtotal,
            Discount = o.Discount,
            OrderDate = DateTime.SpecifyKind(o.OrderDate, DateTimeKind.Utc),
            OrderTotal = o.GetTotal(),
            Items = [.. o.OrderItems.Select(
                oi => new OrderItemDto
                {
                    Id = oi.ItemOrdered.MenuItemId,
                    MenuItemId = oi.ItemOrdered.MenuItemId,
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
            TableId = o.TableId,
            TableCode = o.TableCode,
            OrderType = o.OrderType,
            NumberOfPeople = o.NumberOfPeople,
            BuyerName = o.BuyerName,
            BuyerEmail = o.BuyerEmail,
            BuyerNote = o.BuyerNote,
            OrderStatus = o.OrderStatus,
            CreatedAt = o.CreatedAt,
            UpdatedAt = o.UpdatedAt,
            Subtotal = o.Subtotal,
            Discount = o.Discount,
            OrderDate = DateTime.SpecifyKind(o.OrderDate, DateTimeKind.Utc),
            OrderTotal = o.Subtotal - o.Discount,
            Items = o.OrderItems.Select(oi => new OrderItemDto { Id = oi.ItemOrdered.MenuItemId, MenuItemId = oi.ItemOrdered.MenuItemId, Name = oi.ItemOrdered.Name, ImageUrl = oi.ItemOrdered.ImageUrl, Price = oi.Price, Quantity = oi.Quantity, Note = oi.Note }).ToList()
        });
    }
}
