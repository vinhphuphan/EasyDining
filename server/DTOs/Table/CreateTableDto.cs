using System;

namespace server.DTOs.Table;

public class CreateTableDto
{
    public string Name { get; set; } = string.Empty;
    public int Seats { get; set; }
}
