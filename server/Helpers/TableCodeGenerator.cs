using System.Security.Cryptography;

namespace server.Helpers;

public static class TableCodeGenerator
{
    private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private const int Size = 6;

    public static string Generate()
    {
        var bytes = RandomNumberGenerator.GetBytes(Size);
        var chars = new char[Size];

        for (int i = 0; i < Size; i++)
        {
            chars[i] = Alphabet[bytes[i] % Alphabet.Length];
        }

        return new string(chars);
    }
}
