const API_BASE_URL = 'http://localhost:5126/api/Ventas';
const CLIENTES_API_URL = 'http://localhost:5126/api/Clientes'; 
const PRODUCTOS_API_URL = 'http://localhost:5126/api/Productos';

let productosData = [];

async function loadClienteProductoData() {
    try {
        const clientesResponse = await fetch(CLIENTES_API_URL);
        const clientes = await clientesResponse.json();
        const clienteSelect = document.getElementById('venta-clienteId');
        
        clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
        clientes.forEach(cliente => {
            clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nombre} ${cliente.apellido} (ID: ${cliente.id})</option>`;
        });

        const productosResponse = await fetch(PRODUCTOS_API_URL);
        const productos = await productosResponse.json();
        const productoSelect = document.getElementById('venta-productoId');
        
        productosData = productos;

        productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
        productos.forEach(producto => {
            productoSelect.innerHTML += `<option value="${producto.id}">${producto.nombre} ($${producto.precio.toFixed(2)})</option>`;
        });

        productoSelect.addEventListener('change', updatePrecioUnitario);

    } catch (error) {
        console.error('Error al cargar datos de Clientes o Productos:', error);
        alert('Error al cargar datos necesarios. Verifique la API de Clientes/Productos.');
    }
}

function updatePrecioUnitario() {
    const productoId = parseInt(document.getElementById('venta-productoId').value);
    const producto = productosData.find(p => p.id === productoId);

    const precioUnitarioInput = document.getElementById('venta-precio-unitario');
    const displayPrecioSpan = document.getElementById('display-precio-unitario');

    if (producto) {
        precioUnitarioInput.value = producto.precio;
        displayPrecioSpan.textContent = `$${producto.precio.toFixed(2)}`;
    } else {
        precioUnitarioInput.value = '';
        displayPrecioSpan.textContent = '$0.00';
    }
}

async function loadVentas() {
    const tbody = document.getElementById('ventas-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7">Cargando ventas desde la API...</td></tr>';

    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}. ¿Está corriendo la API en el puerto 5126?`);
        }

        const ventas = await response.json();
        let htmlContent = '';

        if (ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No hay ventas registradas en la API.</td></tr>';
            return;
        }

        ventas.forEach(venta => {
            const clienteNombre = venta.cliente?.nombre || `ID: ${venta.clienteId}`;
            const productoNombre = venta.producto?.nombre || `ID: ${venta.productoId}`;
            
            const localidad = venta.cliente?.zona || 'N/A'; 
            
            htmlContent += `
                <tr>
                    <td>${venta.id}</td>
                    <td>${clienteNombre}</td>
                    <td>${productoNombre}</td>
                    <td>${venta.cantidad}</td>
                    <td>$${venta.precioUnitario.toFixed(2)}</td>
                    <td>${venta.metodoPago}</td>
                    <td>${localidad}</td>
                </tr>
            `;
        });

        tbody.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error al cargar ventas:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="color: red;">❌ Error de conexión: ${error.message}.</td></tr>`;
    }
}

async function submitVenta(event) {
    event.preventDefault();
    const form = event.target;
    
    const clienteId = parseInt(document.getElementById('venta-clienteId').value); 
    const productoId = parseInt(document.getElementById('venta-productoId').value); 
    const precioUnitario = parseFloat(document.getElementById('venta-precio-unitario').value);

    if (isNaN(clienteId) || isNaN(productoId) || isNaN(precioUnitario) || precioUnitario <= 0) {
        alert('❌ Error de validación: Por favor, seleccione un Cliente y un Producto válidos.');
        return; 
    }

    const ventaData = {
        clienteId: clienteId, 
        productoId: productoId, 
        cantidad: parseInt(document.getElementById('venta-cantidad').value),
        precioUnitario: precioUnitario,
        metodoPago: document.getElementById('venta-metodoPago').value,
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        });

        if (response.ok) {
            alert('✅ Venta registrada con éxito!');
            form.reset(); 
            document.getElementById('display-precio-unitario').textContent = '$0.00';
            document.getElementById('venta-precio-unitario').value = '';

            loadVentas(); 
            
            // COMENTADO: No recargar gráficos automáticamente
            // Los gráficos se recargarán solo cuando el usuario cambie a la pestaña de estadísticas
            /*
            if (document.getElementById('estadisticas-section').style.display !== 'none' && typeof loadAllCharts === 'function') {
                loadAllCharts();
            }
            */
        } else {
            const errorText = await response.text();
            throw new Error(`Fallo en el registro. Status: ${response.status}. Mensaje: ${errorText}`);
        }

    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert(`❌ Error al registrar la venta. Consulte la consola para más detalles.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('venta-form');
    if (form) {
        form.addEventListener('submit', submitVenta);
    }
    
    loadClienteProductoData();
    loadVentas();
});