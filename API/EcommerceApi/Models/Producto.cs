namespace EcommerceApi.Models;

public class Producto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
    public string Categoria { get; set; } = "";
    public double Precio { get; set; }
    public int Stock { get; set; }
}