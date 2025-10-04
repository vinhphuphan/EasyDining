namespace server.Entities;

public class Employee
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;

    // PIN to sign in (6 digits)
    public required string PinCode { get; set; } = string.Empty;
    // Shift
    public TimeSpan ShiftStart { get; set; }
    public TimeSpan ShiftEnd { get; set; }
}
