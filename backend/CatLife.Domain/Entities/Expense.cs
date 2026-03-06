using System.ComponentModel.DataAnnotations.Schema;

namespace CatLife.Domain.Entities;

public class Expense : BaseEntity
{
    public int CatId { get; set; }
    public Cat? Cat { get; set; }

    public required string Category { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    
    public DateTime Date { get; set; }
}