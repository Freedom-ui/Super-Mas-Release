let chartInstances = {};

const chartColors = [
    '#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffc107', '#a05195', 
    '#00876c', '#60a374', '#a0bf7e', '#d8db9c', '#fbe7b3', '#fff8e3'
];

const API_STATS_BASE = 'http://localhost:5126/api/Estadisticas';

let chartsLoaded = false;
let loadingInProgress = false;

function destroyAllCharts() {
    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) {
            try {
                chartInstances[key].destroy();
            } catch (e) {
                console.warn(`Error al destruir ${key}:`, e);
            }
        }
    });
    chartInstances = {};
}

function drawChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas ID '${canvasId}' no encontrado`);
        return null;
    }
    
    if (chartInstances[canvasId]) {
        try {
            chartInstances[canvasId].destroy();
        } catch (e) {
            console.warn(`Error al destruir ${canvasId}:`, e);
        }
    }
    
    const ctx = canvas.getContext('2d');
    chartInstances[canvasId] = new Chart(ctx, config);
    return chartInstances[canvasId];
}

function showChartError(canvasId, errorMessage) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ff6361';
    ctx.textAlign = 'center';
    ctx.fillText('Error al cargar datos', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(errorMessage, canvas.width / 2, canvas.height / 2 + 15);
}

async function fetchStatData(endpoint) {
    try {
        const response = await fetch(`${API_STATS_BASE}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`Error en ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
}

async function loadValorStockPorCategoria() {
    const result = await fetchStatData('ValorStockPorCategoria');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('valorStockChart', result.error || 'Sin datos');
        return;
    }
    drawChart('valorStockChart', {
        type: 'bar',
        data: {
            labels: result.data.map(item => item.categoria),
            datasets: [{
                label: 'Valor Total de Stock ($)',
                data: result.data.map(item => item.valorTotalInventario),
                backgroundColor: chartColors[6],
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } } 
        }
    });
}

async function loadTop5Productos() {
    const result = await fetchStatData('Top5ProductosPorVenta');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('top5ProductosChart', result.error || 'Sin datos');
        return;
    }
    drawChart('top5ProductosChart', {
        type: 'doughnut',
        data: {
            labels: result.data.map(item => item.producto),
            datasets: [{
                label: 'Ingresos',
                data: result.data.map(item => item.ingresoTotal),
                backgroundColor: chartColors.slice(0, result.data.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

async function loadCLV() {
    const result = await fetchStatData('ValorVidaCliente');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('clvChart', result.error || 'Sin datos');
        return;
    }
    drawChart('clvChart', {
        type: 'bar',
        data: {
            labels: result.data.map(item => item.cliente),
            datasets: [{
                label: 'Gasto Total por Cliente ($)',
                data: result.data.map(item => item.totalGastado),
                backgroundColor: chartColors[2],
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', 
            scales: { x: { beginAtZero: true } } 
        }
    });
}

async function loadVentasPorMetodoPago() {
    const result = await fetchStatData('VentasPorMetodoPago');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('metodoPagoChart', result.error || 'Sin datos');
        return;
    }
    drawChart('metodoPagoChart', {
        type: 'pie',
        data: {
            labels: result.data.map(item => item.metodo),
            datasets: [{
                label: 'Total Vendido ($)',
                data: result.data.map(item => item.totalVentas),
                backgroundColor: chartColors.slice(0, result.data.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

async function loadStockVsPrecio() {
    const result = await fetchStatData('StockVsPrecio');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('stockVsPrecioChart', result.error || 'Sin datos');
        return;
    }
    const scatterData = result.data.map(item => ({ 
        x: item.precio, 
        y: item.stock, 
        nombre: item.nombre 
    }));
    drawChart('stockVsPrecioChart', {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Stock vs Precio',
                data: scatterData,
                backgroundColor: chartColors[0],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = context.raw;
                            return `${item.nombre} | Precio: $${item.x} | Stock: ${item.y}`;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    type: 'linear', 
                    position: 'bottom', 
                    title: { display: true, text: 'Precio del Producto ($)' },
                    beginAtZero: true
                },
                y: { 
                    title: { display: true, text: 'Stock Disponible' },
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadEdadPorProducto() {
    const result = await fetchStatData('EdadPorProducto');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('edadPorProductoChart', result.error || 'Sin datos');
        return;
    }
    drawChart('edadPorProductoChart', {
        type: 'bar',
        data: {
            labels: result.data.map(item => item.producto),
            datasets: [{
                label: 'Edad Promedio de Compradores',
                data: result.data.map(item => item.edadPromedio),
                backgroundColor: chartColors[3],
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } } 
        }
    });
}

async function loadVentasPorDia() {
    const result = await fetchStatData('VentasPorDia');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('ventasPorDiaChart', result.error || 'Sin datos');
        return;
    }
    drawChart('ventasPorDiaChart', {
        type: 'line',
        data: {
            labels: result.data.map(item => item.dia),
            datasets: [{
                label: 'Ventas Diarias ($)',
                data: result.data.map(item => item.totalVentas),
                borderColor: '#00876c',
                backgroundColor: 'rgba(0, 135, 108, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } } 
        }
    });
}

async function loadVentasPorHora() {
    const result = await fetchStatData('VentasPorHora');
    if (!result.success || !result.data || result.data.length === 0) {
        showChartError('ventasPorHoraChart', result.error || 'Sin datos');
        return;
    }
    drawChart('ventasPorHoraChart', {
        type: 'bar',
        data: {
            labels: result.data.map(item => `${item.hora}:00`),
            datasets: [{
                label: 'Ventas por Hora del Día ($)',
                data: result.data.map(item => item.totalVentas),
                backgroundColor: chartColors[1],
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } } 
        }
    });
}

function loadAllCharts() {
    if (loadingInProgress) {
        return;
    }
    
    if (chartsLoaded) {
        return;
    }
    
    loadingInProgress = true;
    destroyAllCharts();
    
    Promise.all([
        loadValorStockPorCategoria(),
        loadTop5Productos(),
        loadCLV(),
        loadVentasPorMetodoPago(),
        loadStockVsPrecio(),
        loadEdadPorProducto(),
        loadVentasPorDia(),
        loadVentasPorHora()
    ]).then(() => {
        chartsLoaded = true;
        loadingInProgress = false;
    }).catch(error => {
        console.error('Error al cargar graficos:', error);
        loadingInProgress = false;
    });
}

window.loadAllCharts = loadAllCharts;
window.destroyAllCharts = destroyAllCharts;