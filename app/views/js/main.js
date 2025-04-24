document.addEventListener('DOMContentLoaded', () => {
    cargarVendedores();
    cargarDistritos();
    
    // Configurar el buscador
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(buscarVendedores, 300));
    
    // Manejar el envío del formulario
    document.getElementById('vendedorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const vendedor = {
            nom_ven: document.getElementById('nom_ven').value.trim(),
            apel_ven: document.getElementById('apel_ven').value.trim(),
            cel_ven: document.getElementById('cel_ven').value.trim(),
            id_distrito: document.getElementById('distrito').value.trim() || null
        };

        // Validaciones
        if (!vendedor.nom_ven) {
            Modals.error('Error de validación', 'El nombre del vendedor no puede estar vacío');
            return;
        }
        if (!vendedor.apel_ven) {
            Modals.error('Error de validación', 'El apellido del vendedor no puede estar vacío');
            return;
        }
        if (!/^[0-9]{9}$/.test(vendedor.cel_ven)) {
            Modals.error('Error de validación', 'El número de celular debe tener exactamente 9 dígitos');
            return;
        }

        try {
            let response;
            if (form.dataset.modo === 'editar') {
                // Modo edición
                response = await fetch(`/api/vendedores/${form.dataset.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vendedor)
                });
            } else {
                // Modo creación
                response = await fetch('/api/vendedores', {
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
                    // Cerrar el modal después de guardar
                    const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
                    if (modal) modal.hide();
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
        const response = await fetch(`/api/vendedores/search?term=${encodeURIComponent(searchTerm)}`);
        
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
            <td>${vendedor.apel_ven}</td>
            <td>${vendedor.cel_ven}</td>
            <td>${vendedor.distrito}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarVendedor(${vendedor.id_ven})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarVendedor(${vendedor.id_ven})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function cargarDistritos() {
    try {
        const response = await fetch('/view/distritos');
        if (!response.ok) {
            throw new Error('Error al cargar distritos');
        }
        const distritos = await response.json();
        const selectDistrito = document.getElementById('distrito');
        
        // Mantener la opción por defecto
        const defaultOption = selectDistrito.firstElementChild;
        selectDistrito.innerHTML = '';
        selectDistrito.appendChild(defaultOption);
        
        distritos.forEach(distrito => {
            const option = document.createElement('option');
            option.value = distrito.id_distrito;
            option.textContent = distrito.nombre;
            selectDistrito.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        Modals.error('Error', 'Error al cargar los distritos');
    }
}

async function cargarVendedores() {
    try {
        const response = await fetch('/api/vendedores');
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
        const response = await fetch(`/api/vendedores/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener vendedor');
        }
        const vendedor = await response.json();
        console.log('Datos del vendedor recibidos:', vendedor); // Log para depuración

        // Verificar que los datos existen antes de asignarlos
        if (vendedor) {
            document.getElementById('nom_ven').value = vendedor.nom_ven || '';
            document.getElementById('apel_ven').value = vendedor.apel_ven || '';
            document.getElementById('cel_ven').value = vendedor.cel_ven || '';
            document.getElementById('distrito').value = vendedor.id_distrito || '';
            
            // Cambiar el formulario para modo edición
            const form = document.getElementById('vendedorForm');
            form.dataset.modo = 'editar';
            form.dataset.id = id;
            document.querySelector('button[type="submit"]').textContent = 'Actualizar';
            
            // Mostrar el modal de edición
            const modal = new bootstrap.Modal(document.getElementById('registroModal'));
            modal.show();
        } else {
            throw new Error('No se recibieron datos del vendedor');
        }
    } catch (error) {
        console.error('Error al cargar vendedor:', error);
        Modals.error('Error', 'Error al cargar datos del vendedor');
    }
}

async function eliminarVendedor(id) {
    Modals.confirmacion(
        '¿Está seguro?', 
        '¿Está seguro de eliminar este vendedor?',
        async () => {
            try {
                const response = await fetch(`/api/vendedores/${id}`, {
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

async function exportarExcel() {
    try {
        const response = await fetch('/export/excel');
        if (!response.ok) {
            throw new Error('Error al exportar a Excel');
        }
        
        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Vendedores.xlsx';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error:', error);
        Modals.error('Error', 'Error al exportar a Excel');
    }
}

async function exportarPDF() {
    try {
        const response = await fetch('/export/pdf');
        if (!response.ok) {
            throw new Error('Error al exportar a PDF');
        }
        
        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Vendedores.pdf';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error:', error);
        Modals.error('Error', 'Error al exportar a PDF');
    }
} 