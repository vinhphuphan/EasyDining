namespace server.Entities;

public class Employee : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Role { get; set; } = "";
    
    // PIN to sign in (6 digits)
    public required string PinCode { get; set; } = string.Empty;
    // Shift
    public TimeSpan ShiftStart { get; set; }
    public TimeSpan ShiftEnd { get; set; }
}
