namespace server.Entities;

public class Order
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public Table? Table { get; set; }

    public int? EmployeeId { get; set; }
    public Employee? Employee { get; set; }


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string CustomerContact { get; set; } = string.Empty; // phone/email

    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed

    public ICollection<OrderItem>? OrderItems { get; set; }

    // Payment info (tạm thời lưu đơn giản)
    public string PaymentStatus { get; set; } = "Unpaid"; // Paid / Unpaid / Pending
    public decimal TotalAmount { get; set; }
}
