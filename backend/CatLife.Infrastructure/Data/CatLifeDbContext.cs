using CatLife.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatLife.Infrastructure.Data;

public class CatLifeDbContext : DbContext
{
    public CatLifeDbContext(DbContextOptions<CatLifeDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Cat> Cats { get; set; }
    public DbSet<HealthRecord> HealthRecords { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AIConsult> AIConsults { get; set; }
    public DbSet<TelegramLink> TelegramLinks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasOne(u => u.TelegramLink)
            .WithOne(t => t.User)
            .HasForeignKey<TelegramLink>(t => t.UserId);

        modelBuilder.Entity<Cat>()
            .HasOne(c => c.Owner)
            .WithMany(u => u.Cats)
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<HealthRecord>()
            .HasOne(h => h.Cat)
            .WithMany(c => c.HealthRecords)
            .HasForeignKey(h => h.CatId);

        modelBuilder.Entity<Expense>()
            .HasOne(e => e.Cat)
            .WithMany(c => c.Expenses)
            .HasForeignKey(e => e.CatId);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Cat)
            .WithMany(c => c.Appointments)
            .HasForeignKey(a => a.CatId);

        modelBuilder.Entity<AIConsult>()
            .HasOne(a => a.Cat)
            .WithMany(c => c.AIConsults)
            .HasForeignKey(a => a.CatId);
    }
}