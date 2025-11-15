using System.ComponentModel.DataAnnotations;

namespace server.DTOs.MenuItem
{
    public class MenuItemCreateDto
    {
        [Required]
        public string Name { get; set; } = "";

        public string Description { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string Category { get; set; } = "";

        [Required]
        [Range(0.01, 1000)]
        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;
        public bool IsBest { get; set; } = false;
        public bool IsVeg { get; set; } = false;
        public bool IsSpicy { get; set; } = false;
    }
}
