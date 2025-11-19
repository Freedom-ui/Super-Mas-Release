using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using System.Linq; // Necesario para AsEnumerable()
using System;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadisticasController : ControllerBase
{
    private readonly AppDbContext _context;
    public EstadisticasController(AppDbContext context) => _context = context;

    [HttpGet("VentasPorMetodoPago")]
    public IActionResult GetVentasPorMetodoPago() => Ok(_context.Ventas
        .GroupBy(v => v.MetodoPago)
        .Select(g => new { Metodo = g.Key, TotalVentas = g.Sum(v => v.Total) })
        .OrderByDescending(x => x.TotalVentas).ToList());
    
    [HttpGet("VentasPorZona")]
    public IActionResult GetVentasPorZona() => Ok(_context.Ventas
        .Include(v => v.Cliente)
        .Where(v => v.Cliente != null && v.Cliente.Zona != null)
        .GroupBy(v => v.Cliente!.Zona)
        .Select(g => new { Zona = g.Key, TotalVentas = g.Sum(v => v.Total) })
        .OrderByDescending(x => x.TotalVentas).ToList());

    [HttpGet("StockVsPrecio")] 
    public IActionResult GetStockVsPrecio() => Ok(_context.Productos
        .Select(p => new { Nombre = p.Nombre, Precio = p.Precio, Stock = p.Stock })
        .ToList());

    [HttpGet("EdadPorProducto")]
    public IActionResult GetEdadPorProducto() => Ok(_context.Ventas
        .Include(v => v.Producto)
        .Include(v => v.Cliente)
        .Where(v => v.Producto != null && v.Cliente != null)
        .GroupBy(v => v.Producto!.Nombre)
        .Select(g => new
        {
            Producto = g.Key,
            EdadPromedio = g.Average(v => v.Cliente!.Edad),
            RangoEdadMin = g.Min(v => v.Cliente!.Edad),
            RangoEdadMax = g.Max(v => v.Cliente!.Edad)
        }).OrderByDescending(x => x.EdadPromedio).ToList());

    
    [HttpGet("VentasPorDia")]
    public IActionResult GetVentasPorDia() => Ok(_context.Ventas
        .AsEnumerable() 
        .GroupBy(v => v.Fecha.Date)
        .Select(g => new { Dia = g.Key.ToString("yyyy-MM-dd"), TotalVentas = g.Sum(v => v.Total) })
        .OrderBy(x => x.Dia).ToList());
    
    [HttpGet("VentasPorHora")]
    public IActionResult GetVentasPorHora() => Ok(_context.Ventas
        .AsEnumerable() 
        .GroupBy(v => v.Fecha.Hour)
        .Select(g => new { Hora = g.Key, TotalVentas = g.Sum(v => v.Total) })
        .OrderBy(x => x.Hora).ToList());

    // --- NUEVAS Y COMPLEJAS ESTADÍSTICAS SOLICITADAS ---
    // --------------------------------------------------

    [HttpGet("ValorStockPorCategoria")]
    public IActionResult GetValorStockPorCategoria()
    {
        // Calcula el valor total del inventario agrupado por Categoría
        var data = _context.Productos
            .GroupBy(p => p.Categoria)
            .Select(g => new
            {
                Categoria = g.Key,
                ValorTotalInventario = g.Sum(p => p.Precio * p.Stock)
            })
            .OrderByDescending(x => x.ValorTotalInventario)
            .ToList();
        
        return Ok(data);
    }
    
    [HttpGet("Top5ProductosPorVenta")]
    public IActionResult GetTop5ProductosPorVenta()
    {
        // Identifica los 5 productos que más ingresos han generado
        var data = _context.Ventas
            .Include(v => v.Producto)
            .GroupBy(v => v.Producto!.Nombre)
            .Select(g => new
            {
                Producto = g.Key,
                IngresoTotal = g.Sum(v => v.Total)
            })
            .OrderByDescending(x => x.IngresoTotal)
            .Take(5)
            .ToList();
            
        return Ok(data);
    }
    
    [HttpGet("ValorVidaCliente")]
    public IActionResult GetValorVidaCliente()
    {
        // Calcula el Valor de Vida del Cliente (CLV)
        var data = _context.Ventas
            .Include(v => v.Cliente)
            .GroupBy(v => v.Cliente!.Nombre)
            .Select(g => new
            {
                Cliente = g.Key,
                TotalGastado = g.Sum(v => v.Total),
                CantidadCompras = g.Count()
            })
            .OrderByDescending(x => x.TotalGastado)
            .ToList();
            
        return Ok(data);
    }
}