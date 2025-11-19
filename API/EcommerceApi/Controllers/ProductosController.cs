using Microsoft.AspNetCore.Mvc;
using EcommerceApi.Data;
using EcommerceApi.Models;

namespace EcommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly AppDbContext _context;
    public ProductosController(AppDbContext context) => _context = context;

    [HttpGet]
    public IActionResult Get() => Ok(_context.Productos.ToList());


}