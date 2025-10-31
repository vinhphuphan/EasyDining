using System;
using server.Entities.OrderAggregate;

namespace server.DTOs;

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}
