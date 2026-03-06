using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;

namespace CatLife.Application.Services;

public class CatService : ICatService
{
    private readonly ICatRepository _catRepository;

    public CatService(ICatRepository catRepository)
    {
        _catRepository = catRepository;
    }

    public async Task<IEnumerable<Cat>> GetMyCatsAsync(int userId)
    {
        return await _catRepository.GetByUserIdAsync(userId);
    }

    public async Task<Cat> CreateCatAsync(int userId, CreateCatInput input)
    {
        var cat = new Cat
        {
            UserId = userId,
            Name = input.Name,
            Breed = input.Breed,
            Color = input.Color,
            BirthDate = DateTime.SpecifyKind(input.BirthDate, DateTimeKind.Utc),
            IsCastrated = input.IsCastrated
        };

        await _catRepository.AddAsync(cat);
        await _catRepository.SaveChangesAsync();
        return cat;
    }

    public async Task<Cat?> UpdateCatAsync(int userId, int catId, UpdateCatInput input)
    {
        var cat = await _catRepository.GetByIdAsync(catId);
        if (cat == null || cat.UserId != userId) return null;

        cat.Name = input.Name;
        cat.Breed = input.Breed;
        cat.Color = input.Color;
        cat.BirthDate = DateTime.SpecifyKind(input.BirthDate, DateTimeKind.Utc);
        cat.IsCastrated = input.IsCastrated;

        await _catRepository.UpdateAsync(cat);
        await _catRepository.SaveChangesAsync();
        return cat;
    }

    public async Task<bool> DeleteCatAsync(int userId, int catId)
    {
        var cat = await _catRepository.GetByIdAsync(catId);
        if (cat == null || cat.UserId != userId) return false;

        await _catRepository.DeleteAsync(cat);
        await _catRepository.SaveChangesAsync();
        return true;
    }
}