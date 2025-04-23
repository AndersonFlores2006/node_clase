/**
 * Modals.js - Biblioteca para crear ventanas modales atractivas
 * Este archivo proporciona funciones para mostrar ventanas modales de confirmación, éxito y error
 */

// Crear el contenedor principal para las modales si no existe
function crearContenedorModales() {
    if (!document.getElementById('modales-container')) {
        const container = document.createElement('div');
        container.id = 'modales-container';
        document.body.appendChild(container);
    }
    return document.getElementById('modales-container');
}

// Agregar estilos CSS para las modales
function agregarEstilosModales() {
    if (!document.getElementById('estilos-modales')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-modales';
        estilos.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-container {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 400px;
                padding: 20px;
                text-align: center;
                animation: slideIn 0.3s ease;
            }
            
            .modal-icon {
                width: 70px;
                height: 70px;
                margin: 0 auto 15px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-icon.success {
                background-color: #d4edda;
                color: #28a745;
            }
            
            .modal-icon.error {
                background-color: #f8d7da;
                color: #dc3545;
            }
            
            .modal-icon.warning {
                background-color: #fff3cd;
                color: #ffc107;
            }
            
            .modal-icon svg {
                width: 40px;
                height: 40px;
            }
            
            .modal-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .modal-message {
                margin-bottom: 20px;
                color: #555;
            }
            
            .modal-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }
            
            .modal-btn {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .modal-btn-primary {
                background-color: #6366f1;
                color: white;
            }
            
            .modal-btn-primary:hover {
                background-color: #4f46e5;
            }
            
            .modal-btn-secondary {
                background-color: #e5e7eb;
                color: #374151;
            }
            
            .modal-btn-secondary:hover {
                background-color: #d1d5db;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(estilos);
    }
}

// Crear el HTML para los iconos SVG
const iconos = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
};

// Función para mostrar una modal de confirmación
function mostrarConfirmacion(titulo, mensaje, onConfirmar, onCancelar) {
    agregarEstilosModales();
    const container = crearContenedorModales();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-icon warning">${iconos.warning}</div>
            <div class="modal-title">${titulo}</div>
            <div class="modal-message">${mensaje}</div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-secondary" id="btn-cancelar">Cancelar</button>
                <button class="modal-btn modal-btn-primary" id="btn-confirmar">Aceptar</button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // Configurar eventos de botones
    document.getElementById('btn-confirmar').addEventListener('click', () => {
        container.removeChild(modal);
        if (typeof onConfirmar === 'function') onConfirmar();
    });
    
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        container.removeChild(modal);
        if (typeof onCancelar === 'function') onCancelar();
    });
}

// Función para mostrar una modal de éxito
function mostrarExito(titulo, mensaje, onCerrar) {
    agregarEstilosModales();
    const container = crearContenedorModales();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-icon success">${iconos.success}</div>
            <div class="modal-title">${titulo}</div>
            <div class="modal-message">${mensaje}</div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" id="btn-ok">OK</button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // Configurar evento del botón
    document.getElementById('btn-ok').addEventListener('click', () => {
        container.removeChild(modal);
        if (typeof onCerrar === 'function') onCerrar();
    });
}

// Función para mostrar una modal de error
function mostrarError(titulo, mensaje, onCerrar) {
    agregarEstilosModales();
    const container = crearContenedorModales();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-icon error">${iconos.error}</div>
            <div class="modal-title">${titulo}</div>
            <div class="modal-message">${mensaje}</div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" id="btn-ok">OK</button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // Configurar evento del botón
    document.getElementById('btn-ok').addEventListener('click', () => {
        container.removeChild(modal);
        if (typeof onCerrar === 'function') onCerrar();
    });
}

// Exportar las funciones
window.Modals = {
    confirmacion: mostrarConfirmacion,
    exito: mostrarExito,
    error: mostrarError
};