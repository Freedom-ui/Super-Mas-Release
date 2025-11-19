using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly AppDbContext _context;
    public VentasController(AppDbContext context) => _context = context;

    [HttpGet]
    public IActionResult Get()
    {
        var ventas = _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Producto)
            .ToList();
        return Ok(ventas);
    }

    [HttpPost]
    public IActionResult Post(Venta v)
    {
        v.Total = v.Cantidad * v.PrecioUnitario;
        _context.Ventas.Add(v);
        _context.SaveChanges();
        return Ok(v);
    }
}