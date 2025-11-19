using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;

namespace EcommerceApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Venta> Ventas => Set<Venta>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>().HasData(
            new Cliente { Id = 1, Nombre = "Juan", Apellido = "Perez", Correo = "juan.p@mail.com", Zona = "Norte", Edad = 30, Genero = "Masculino" },
            new Cliente { Id = 2, Nombre = "Maria", Apellido = "Gomez", Correo = "maria.g@mail.com", Zona = "Sur", Edad = 25, Genero = "Femenino" },
            new Cliente { Id = 3, Nombre = "Carlos", Apellido = "Lopez", Correo = "carlos.l@mail.com", Zona = "Este", Edad = 45, Genero = "Masculino" },
            new Cliente { Id = 4, Nombre = "Ana", Apellido = "Ruiz", Correo = "ana.r@mail.com", Zona = "Norte", Edad = 50, Genero = "Femenino" },
            new Cliente { Id = 5, Nombre = "Pedro", Apellido = "Diaz", Correo = "pedro.d@mail.com", Zona = "Oeste", Edad = 22, Genero = "Masculino" },
            new Cliente { Id = 6, Nombre = "Laura", Apellido = "Martinez", Correo = "laura.m@mail.com", Zona = "Centro", Edad = 35, Genero = "Femenino" },
            new Cliente { Id = 7, Nombre = "Roberto", Apellido = "Sanchez", Correo = "roberto.s@mail.com", Zona = "Sur", Edad = 28, Genero = "Masculino" }
        );

        modelBuilder.Entity<Producto>().HasData(
            new Producto { Id = 101, Nombre = "Leche Entera 1L", Categoria = "Lacteos", Precio = 1.50, Stock = 200 },
            new Producto { Id = 102, Nombre = "Yogur Natural 500g", Categoria = "Lacteos", Precio = 2.20, Stock = 150 },
            new Producto { Id = 103, Nombre = "Queso Mozzarella 400g", Categoria = "Lacteos", Precio = 4.50, Stock = 80 },
            new Producto { Id = 104, Nombre = "Pollo Entero kg", Categoria = "Carnes", Precio = 5.80, Stock = 60 },
            new Producto { Id = 105, Nombre = "Carne Molida kg", Categoria = "Carnes", Precio = 8.50, Stock = 45 },
            new Producto { Id = 106, Nombre = "Chuletas de Cerdo kg", Categoria = "Carnes", Precio = 7.20, Stock = 30 },
            new Producto { Id = 107, Nombre = "Manzanas Rojas kg", Categoria = "Frutas", Precio = 2.80, Stock = 120 },
            new Producto { Id = 108, Nombre = "Bananas kg", Categoria = "Frutas", Precio = 1.90, Stock = 150 },
            new Producto { Id = 109, Nombre = "Tomates kg", Categoria = "Verduras", Precio = 2.50, Stock = 100 },
            new Producto { Id = 110, Nombre = "Lechuga Unidad", Categoria = "Verduras", Precio = 1.20, Stock = 90 },
            new Producto { Id = 111, Nombre = "Pan Integral 500g", Categoria = "Panaderia", Precio = 1.80, Stock = 200 },
            new Producto { Id = 112, Nombre = "Medialunas x6", Categoria = "Panaderia", Precio = 3.50, Stock = 100 },
            new Producto { Id = 113, Nombre = "Agua Mineral 2L", Categoria = "Bebidas", Precio = 0.90, Stock = 300 },
            new Producto { Id = 114, Nombre = "Coca Cola 2L", Categoria = "Bebidas", Precio = 2.50, Stock = 180 },
            new Producto { Id = 115, Nombre = "Jugo de Naranja 1L", Categoria = "Bebidas", Precio = 2.10, Stock = 120 },
            new Producto { Id = 116, Nombre = "Arroz Blanco 1kg", Categoria = "Despensa", Precio = 1.80, Stock = 250 },
            new Producto { Id = 117, Nombre = "Fideos Secos 500g", Categoria = "Despensa", Precio = 1.20, Stock = 300 },
            new Producto { Id = 118, Nombre = "Aceite Girasol 1L", Categoria = "Despensa", Precio = 3.50, Stock = 100 },
            new Producto { Id = 119, Nombre = "Azucar 1kg", Categoria = "Despensa", Precio = 1.50, Stock = 200 },
            new Producto { Id = 120, Nombre = "Sal Fina 500g", Categoria = "Despensa", Precio = 0.80, Stock = 150 }
        );

        var baseDate = new DateTime(2025, 11, 10, 10, 0, 0);

        modelBuilder.Entity<Venta>().HasData(
            new Venta { Id = 1, ClienteId = 1, ProductoId = 101, Cantidad = 2, PrecioUnitario = 1.50, MetodoPago = "TC", Total = 3.00, Fecha = baseDate.AddDays(0).AddHours(8) },
            new Venta { Id = 2, ClienteId = 2, ProductoId = 113, Cantidad = 5, PrecioUnitario = 0.90, MetodoPago = "Efectivo", Total = 4.50, Fecha = baseDate.AddDays(0).AddHours(14) },
            new Venta { Id = 3, ClienteId = 3, ProductoId = 116, Cantidad = 3, PrecioUnitario = 1.80, MetodoPago = "TD", Total = 5.40, Fecha = baseDate.AddDays(0).AddHours(18) },
            
            new Venta { Id = 4, ClienteId = 4, ProductoId = 107, Cantidad = 2, PrecioUnitario = 2.80, MetodoPago = "QR", Total = 5.60, Fecha = baseDate.AddDays(1).AddHours(9) },
            new Venta { Id = 5, ClienteId = 5, ProductoId = 111, Cantidad = 4, PrecioUnitario = 1.80, MetodoPago = "Efectivo", Total = 7.20, Fecha = baseDate.AddDays(1).AddHours(12) },
            new Venta { Id = 6, ClienteId = 6, ProductoId = 114, Cantidad = 3, PrecioUnitario = 2.50, MetodoPago = "TC", Total = 7.50, Fecha = baseDate.AddDays(1).AddHours(16) },
            new Venta { Id = 7, ClienteId = 7, ProductoId = 105, Cantidad = 1, PrecioUnitario = 8.50, MetodoPago = "TD", Total = 8.50, Fecha = baseDate.AddDays(1).AddHours(19) },
            
            new Venta { Id = 8, ClienteId = 1, ProductoId = 108, Cantidad = 2, PrecioUnitario = 1.90, MetodoPago = "Efectivo", Total = 3.80, Fecha = baseDate.AddDays(2).AddHours(10) },
            new Venta { Id = 9, ClienteId = 2, ProductoId = 119, Cantidad = 3, PrecioUnitario = 1.50, MetodoPago = "QR", Total = 4.50, Fecha = baseDate.AddDays(2).AddHours(15) },
            new Venta { Id = 10, ClienteId = 3, ProductoId = 104, Cantidad = 2, PrecioUnitario = 5.80, MetodoPago = "TC", Total = 11.60, Fecha = baseDate.AddDays(2).AddHours(20) },
            
            new Venta { Id = 11, ClienteId = 4, ProductoId = 117, Cantidad = 5, PrecioUnitario = 1.20, MetodoPago = "TD", Total = 6.00, Fecha = baseDate.AddDays(3).AddHours(11) },
            new Venta { Id = 12, ClienteId = 5, ProductoId = 102, Cantidad = 2, PrecioUnitario = 2.20, MetodoPago = "Efectivo", Total = 4.40, Fecha = baseDate.AddDays(3).AddHours(13) },
            new Venta { Id = 13, ClienteId = 6, ProductoId = 109, Cantidad = 3, PrecioUnitario = 2.50, MetodoPago = "QR", Total = 7.50, Fecha = baseDate.AddDays(3).AddHours(17) },
            
            new Venta { Id = 14, ClienteId = 7, ProductoId = 115, Cantidad = 4, PrecioUnitario = 2.10, MetodoPago = "TC", Total = 8.40, Fecha = baseDate.AddDays(4).AddHours(9) },
            new Venta { Id = 15, ClienteId = 1, ProductoId = 106, Cantidad = 1, PrecioUnitario = 7.20, MetodoPago = "TD", Total = 7.20, Fecha = baseDate.AddDays(4).AddHours(14) },
            new Venta { Id = 16, ClienteId = 2, ProductoId = 112, Cantidad = 2, PrecioUnitario = 3.50, MetodoPago = "Efectivo", Total = 7.00, Fecha = baseDate.AddDays(4).AddHours(18) },
            
            new Venta { Id = 17, ClienteId = 3, ProductoId = 118, Cantidad = 1, PrecioUnitario = 3.50, MetodoPago = "QR", Total = 3.50, Fecha = baseDate.AddDays(5).AddHours(10) },
            new Venta { Id = 18, ClienteId = 4, ProductoId = 103, Cantidad = 2, PrecioUnitario = 4.50, MetodoPago = "TC", Total = 9.00, Fecha = baseDate.AddDays(5).AddHours(15) },
            
            new Venta { Id = 19, ClienteId = 5, ProductoId = 110, Cantidad = 3, PrecioUnitario = 1.20, MetodoPago = "TD", Total = 3.60, Fecha = baseDate.AddDays(6).AddHours(11) },
            new Venta { Id = 20, ClienteId = 6, ProductoId = 120, Cantidad = 4, PrecioUnitario = 0.80, MetodoPago = "Efectivo", Total = 3.20, Fecha = baseDate.AddDays(6).AddHours(16) }
        );
        base.OnModelCreating(modelBuilder);
    }
}