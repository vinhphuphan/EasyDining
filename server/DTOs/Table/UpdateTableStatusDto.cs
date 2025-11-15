namespace server.DTOs.Table;

public class UpdateTableStatusDto
{
    public int TableId { get; set; }
    public string Status { get; set; } = string.Empty;
}
