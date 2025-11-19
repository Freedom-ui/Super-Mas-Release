async function loadComponent(componentPath, targetId) {
    try {
      const response = await fetch(componentPath);
      const html = await response.text();
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error cargando ${componentPath}:`, error);
    }
  }

  // --- FUNCIÓN PARA OBTENER Y MOSTRAR LOS PRODUCTOS ---
  async function loadProducts() {
    // Endpoint de la API
    const apiURL = 'http://localhost:5126/api/Productos'; 
    const targetId = 'products-placeholder';
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
        console.error(`Elemento con ID '${targetId}' no encontrado.`);
        return;
    }

    try {
        targetElement.innerHTML = 'Cargando productos...';

        const response = await fetch(apiURL);
        
        if (!response.ok) {
            // Lanza un error si la respuesta HTTP no es exitosa (ej. 404, 500)
            throw new Error(`Error HTTP: ${response.status}. Asegúrese que la API (.NET) esté corriendo.`);
        }

        const products = await response.json();
        
        let htmlContent = '<h2>🛒 Nuestros Productos en Venta 🛒</h2><div class="product-grid">';
        
        if (products.length > 0) {
            products.forEach(product => {
                // Genera una tarjeta de producto con datos del API
                // Se asume el uso de las propiedades 'id', 'nombre' y 'precio' de su modelo Producto.cs
                htmlContent += `
                    <div class="product-card">
                        <h3>${product.nombre}</h3>
                        <p class="product-price">Precio: $${product.precio.toFixed(2)}</p>
                        <button onclick="console.log('Comprando: ${product.nombre} (ID: ${product.id})')">Añadir al Carrito</button>
                    </div>
                `;
            });
        } else {
             htmlContent = '<h2>Nuestros Productos</h2><p>No se encontraron productos. Revise la base de datos de la API.</p>';
        }

        htmlContent += '</div>';
        targetElement.innerHTML = htmlContent;

    } catch (error) {
      console.error(`Error al cargar los productos desde la API:`, error);
      targetElement.innerHTML = `<p style="color: red;">❌ **ERROR DE CONEXIÓN:** No se pudo cargar el catálogo de productos.</p><p>Verifique que la API esté ejecutándose en http://localhost:5126 y que haya habilitado CORS correctamente.</p>`;
    }
  }
  // ----------------------------------------------------------------------
  
  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../components/navbar.html', 'navbar-placeholder');
    loadComponent('../components/footer.html', 'footer-placeholder');

    // Ejecutar la función para cargar los productos al inicio
    loadProducts(); 
  });