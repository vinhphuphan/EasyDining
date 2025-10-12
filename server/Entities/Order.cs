namespace server.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public string Type { get; set; } = "";
    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed
    public int? Progress { get; set; }
    public int TableId { get; set; }
    public Table? Table { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem>? OrderItems { get; set; }
    // Payment info 
    public string PaymentStatus { get; set; } = "Unpaid"; // Paid / Unpaid / Pending
    public decimal TotalAmount { get; set; }
}
