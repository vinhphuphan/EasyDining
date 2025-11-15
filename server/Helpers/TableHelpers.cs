using server.DTOs.Order;
using server.DTOs.Table;
using server.Entities;

namespace server.Helpers;

public static class TableHelpers
{
    public static TableDto ToDto(this Table table)
    {
        return new TableDto
        {
            Id = table.Id,
            Name = table.Name,
            TableCode = table.TableCode,
            Seats = table.Seats,
            Status = table.Status.ToString(),
            CreatedAt = table.CreatedAt,
            UpdatedAt = table.UpdatedAt,
            Orders = table.Orders?.Select(o => new OrderDto
            {
                Id = o.Id,
                TableId = o.TableId,
                TableCode = o.TableCode,
                TableName = table.Name,
                OrderType = o.OrderType.ToString(),
                NumberOfPeople = o.NumberOfPeople,
                BuyerName = o.BuyerName,
                BuyerEmail = o.BuyerEmail,
                OrderDate = o.OrderDate,
                Subtotal = o.Subtotal,
                Discount = o.Discount,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                OrderTotal = o.GetTotal(),
                OrderStatus = o.OrderStatus,
                Items = [.. o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    MenuItemId = oi.ItemOrdered.MenuItemId,
                    Name = oi.ItemOrdered.Name,
                    ImageUrl = oi.ItemOrdered.ImageUrl,
                    Price = oi.Price,
                    Quantity = oi.Quantity,
                    Note = oi.Note
                })]
            }).ToList() ?? []
        };
    }
}
