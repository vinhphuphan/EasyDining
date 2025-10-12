using System;
using System.Linq.Expressions;

namespace server.Specifications;

public class BaseSpecification<T>
{
    public Expression<Func<T, bool>>? Criteria { get; set; }
    public Func<IQueryable<T>, IOrderedQueryable<T>>? OrderBy { get; set; }
    public int? Skip { get; set; }
    public int? Take { get; set; }
}


