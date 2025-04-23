document.addEventListener('DOMContentLoaded', () => {
    cargarVendedores();
    
    // Configurar el buscador
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(buscarVendedores, 300));
    
    // Manejar el envío del formulario
    document.getElementById('vendedorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const vendedor = {
            nom_ven: document.getElementById('nom_ven').value,
            ape_ven: document.getElementById('ape_ven').value,
            cel_ven: document.getElementById('cel_ven').value
        };

        // Validar número de celular
        if (!/^[0-9]{9}$/.test(vendedor.cel_ven)) {
            Modals.error('Error de validación', 'El número de celular debe tener exactamente 9 dígitos');
            return;
        }

        try {
            let response;
            if (form.dataset.modo === 'editar') {
                // Modo edición
                response = await fetch(`/update/vendedor/${form.dataset.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vendedor)
                });
            } else {
                // Modo creación
                response = await fetch('/create/vendedor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vendedor)
                });
            }

            const data = await response.json();
            if (response.ok) {
                const mensaje = form.dataset.modo === 'editar' ? 'Vendedor actualizado correctamente' : 'Vendedor registrado correctamente';
                Modals.exito('¡Éxito!', mensaje, () => {
                    form.reset();
                    form.dataset.modo = '';
                    form.dataset.id = '';
                    document.querySelector('button[type="submit"]').textContent = 'Guardar';
                    cargarVendedores();
                });
            } else {
                Modals.error('Error', data.error || 'Error en la operación');
            }
        } catch (error) {
            console.error('Error:', error);
            Modals.error('Error de conexión', 'Error al conectar con el servidor');
        }
    });
});

// Función para buscar vendedores
async function buscarVendedores() {
    try {
        const searchTerm = document.getElementById('searchInput').value.trim();
        const response = await fetch(`/view/vendedores/search?term=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('Error al buscar vendedores');
        }
        
        const vendedores = await response.json();
        actualizarTablaVendedores(vendedores);
    } catch (error) {
        console.error('Error:', error);
        // No mostrar alerta para no interrumpir la experiencia del usuario
        console.log('Error al buscar vendedores:', error);
    }
}

// Función para actualizar la tabla de vendedores
function actualizarTablaVendedores(vendedores) {
    const tbody = document.getElementById('vendedoresTableBody');
    tbody.innerHTML = '';
    
    if (vendedores.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="text-center">No se encontraron vendedores</td>';
        tbody.appendChild(tr);
        return;
    }
    
    vendedores.forEach(vendedor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${vendedor.id_ven}</td>
            <td>${vendedor.nom_ven}</td>
            <td>${vendedor.ape_ven}</td>
            <td>${vendedor.cel_ven}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarVendedor(${vendedor.id_ven})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarVendedor(${vendedor.id_ven})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function cargarVendedores() {
    try {
        const response = await fetch('/view/vendedores');
        if (!response.ok) {
            throw new Error('Error al cargar vendedores');
        }
        const vendedores = await response.json();
        actualizarTablaVendedores(vendedores);
    } catch (error) {
        console.error('Error:', error);
        Modals.error('Error', 'Error al cargar vendedores');
    }
}

async function editarVendedor(id) {
    try {
        const response = await fetch(`/view/vendedor/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener vendedor');
        }
        const vendedor = await response.json();
        
        document.getElementById('nom_ven').value = vendedor.nom_ven;
        document.getElementById('ape_ven').value = vendedor.ape_ven;
        document.getElementById('cel_ven').value = vendedor.cel_ven;
        
        // Cambiar el formulario para modo edición
        const form = document.getElementById('vendedorForm');
        form.dataset.modo = 'editar';
        form.dataset.id = id;
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
    } catch (error) {
        console.error('Error:', error);
        Modals.error('Error', 'Error al cargar datos del vendedor');
    }
}

async function eliminarVendedor(id) {
    Modals.confirmacion(
        '¿Está seguro?', 
        '¿Está seguro de eliminar este vendedor?',
        async () => {
            try {
                const response = await fetch(`/delete/vendedor/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Modals.exito('¡Éxito!', 'Vendedor eliminado exitosamente', cargarVendedores);
                } else {
                    const error = await response.json();
                    Modals.error('Error', error.error || 'Error al eliminar vendedor');
                }
            } catch (error) {
                console.error('Error:', error);
                Modals.error('Error de conexión', 'Error al conectar con el servidor');
            }
        }
    );
}

// Función debounce para evitar muchas peticiones durante la búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function obtenerVendedor(id) {
    const response = await fetch(`/view/vendedor/${id}`);
    return await response.json();
}