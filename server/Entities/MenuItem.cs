namespace server.Entities;

public class MenuItem : BaseEntity
{
    public required string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string? Description { get; set; } = "";
    public string? ImageUrl { get; set; } = "";
    public string? Category { get; set; } = "";
    public bool IsAvailable { get; set; } = true;
}
