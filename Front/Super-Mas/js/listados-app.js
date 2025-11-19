const API_BASE_URL = 'http://localhost:5126/api/'; 

/**
 * @param {string} endpoint
 * @param {string} tableBodyId
 * @param {string} loadingElementId
 */
async function cargarListado(endpoint, tableBodyId, loadingElementId) {
    const tableBody = document.getElementById(tableBodyId);
    const loadingElement = document.getElementById(loadingElementId);
    let url = API_BASE_URL + endpoint;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        loadingElement.style.display = 'none';
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${endpoint === 'Clientes' ? 7 : 5}" class="text-center">No hay ${endpoint.toLowerCase()} disponibles.</td></tr>`;
            return;
        }

        data.forEach(item => {
            const row = tableBody.insertRow();
            
            if (endpoint === 'Clientes') {
                // Renderizar Cliente
                row.insertCell().textContent = item.id;
                row.insertCell().textContent = item.nombre;
                row.insertCell().textContent = item.apellido;
                row.insertCell().textContent = item.correo;
                row.insertCell().textContent = item.zona;
                row.insertCell().textContent = item.edad;
                row.insertCell().textContent = item.genero;
            } else if (endpoint === 'Productos') {
                // Renderizar Producto
                row.insertCell().textContent = item.id;
                row.insertCell().textContent = item.nombre;
                row.insertCell().textContent = item.categoria;
                row.insertCell().textContent = `$${item.precio.toFixed(2)}`;
                row.insertCell().textContent = item.stock;
            }
        });

    } catch (error) {
        console.error(`Error al cargar ${endpoint}:`, error);
        loadingElement.textContent = `Error al cargar los datos: ${error.message}`;
        loadingElement.style.display = 'block'; 
        tableBody.innerHTML = `<tr><td colspan="${endpoint === 'Clientes' ? 7 : 5}" class="text-center text-danger">No se pudieron cargar los datos del API.</td></tr>`;
    }
}