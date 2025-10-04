namespace server.Entities;

public class Table
{
    public int Id { get; set; }
    public int TableNo { get; set; } // Ex: 12
    public string Status { get; set; } = "Available"; // Available, Occupied, Reserved
    public int Seats { get; set; }

    // One-to-many: a Table can have many orders
    public ICollection<Order>? Orders { get; set; }
}