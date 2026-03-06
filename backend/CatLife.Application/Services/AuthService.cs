using CatLife.Application.DTOs;
using CatLife.Application.Interfaces;
using CatLife.Domain.Entities;

namespace CatLife.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<AuthPayload> RegisterAsync(RegisterInput input)
    {
        var existingUser = await _userRepository.GetByEmailAsync(input.Email);
        
        if (existingUser != null)
        {
            throw new Exception("Email already in use.");
        }

        var user = new User
        {
            Name = input.Name,
            Email = input.Email,
            PasswordHash = _passwordHasher.Hash(input.Password)
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return new AuthPayload
        {
            User = user,
            AccessToken = _jwtProvider.GenerateToken(user),
            RefreshToken = _jwtProvider.GenerateRefreshToken()
        };
    }

    public async Task<AuthPayload> LoginAsync(LoginInput input)
    {
        var user = await _userRepository.GetByEmailAsync(input.Email);
        
        if (user == null || !_passwordHasher.Verify(user.PasswordHash, input.Password))
        {
            throw new Exception("Invalid credentials.");
        }

        return new AuthPayload
        {
            User = user,
            AccessToken = _jwtProvider.GenerateToken(user),
            RefreshToken = _jwtProvider.GenerateRefreshToken()
        };
    }
}