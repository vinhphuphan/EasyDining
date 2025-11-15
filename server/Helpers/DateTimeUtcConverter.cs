using System.Text.Json;
using System.Text.Json.Serialization;

namespace server.Helpers
{
    /// <summary>
    /// Custom converter to enforce DateTime UTC serialization and deserialization.
    /// </summary>
    public class DateTimeUtcConverter : JsonConverter<DateTime>
    {
        // read from JSON → UTC
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetDateTime();
            return DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        // write JSON →  write UTC + Z
        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToUniversalTime());
        }
    }
}
