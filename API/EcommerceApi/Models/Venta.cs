namespace EcommerceApi.Models;

public class Venta
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public int ClienteId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public double PrecioUnitario { get; set; }
    public string MetodoPago { get; set; } = "";
    public double Total { get; set; }

    public Cliente? Cliente { get; set; }
    public Producto? Producto { get; set; }
}