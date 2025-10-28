namespace server.Entities;

public class MenuItem : BaseEntity
{
    public required string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string? Description { get; set; } = "";
    public required string ImageUrl { get; set; } = "";
    public required string Category { get; set; } = "";
    public bool IsAvailable { get; set; } = true;
    // UI flags
    public bool IsBest { get; set; } = false;
    public bool IsVeg { get; set; } = false;
    public bool IsSpicy { get; set; } = false;
}
