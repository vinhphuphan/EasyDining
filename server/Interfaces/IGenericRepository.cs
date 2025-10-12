using System;
using server.Entities;

namespace server.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> ListAllAsync();
    void Add(T entity);
    void Update(T entity);
    void Remove(T entity);
    Task<bool> SaveChangesAsync();
    bool Exists(int id);
    // Task<T?> GetEntityWithSpec(ISpecification<T> spec);
    // Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
    // Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec);
    // Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T, TResult> spec);
}
