using System;
using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Interfaces;

namespace server.Data;

public class GenericRepository<T>(AppDbContext context) : IGenericRepository<T> where T : BaseEntity
{
    public async Task<IReadOnlyList<T>> ListAllAsync() => await context.Set<T>().ToListAsync();
    public async Task<T?> GetByIdAsync(int id) => await context.Set<T>().FindAsync(id);
    public void Add(T entity) => context.Set<T>().Add(entity);
    public void Update(T entity)
    {
        context.Set<T>().Attach(entity);
        context.Entry(entity).State = EntityState.Modified;
    }
    public void Remove(T entity) => context.Set<T>().Remove(entity);
    public bool Exists(int id) => context.Set<T>().Any(e => e.Id == id);
    public async Task<bool> SaveChangesAsync() => await context.SaveChangesAsync() > 0;
}
