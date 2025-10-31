namespace server.Helpers;

public class PagedList<T>(IEnumerable<T> items, int totalCount, int page, int pageSize)
{
    public IReadOnlyList<T> Items { get; } = [.. items];
    public int Page { get; } = page;
    public int PageSize { get; } = pageSize;
    public int TotalCount { get; } = totalCount;
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
