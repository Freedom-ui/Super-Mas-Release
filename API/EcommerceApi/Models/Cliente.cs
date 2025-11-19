namespace EcommerceApi.Models;

public class Cliente
{
    public int Id { get; set; }
    public string? Nombre { get; set; } 
    public string? Apellido { get; set; }
	public string? Genero { get; set; }	
    public string? Correo { get; set; } 
    public string? Zona { get; set; }
    public int Edad { get; set; }
}