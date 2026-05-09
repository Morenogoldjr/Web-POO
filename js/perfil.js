// API base URL
const API_URL = 'http://localhost:8080/usuarios';

// Obtener ID del usuario de localStorage
function obtenerIdUsuario() {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        alert('Por favor, inicia sesión primero');
        window.location.href = 'login.html';
        return null;
    }
    return usuarioId;
}

// Cargar datos del usuario
async function cargarPerfil() {
    const usuarioId = obtenerIdUsuario();
    if (!usuarioId) return;

    try {
        const response = await fetch(`${API_URL}/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Error al cargar el perfil');
        }
        
        const usuario = await response.json();
        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('correo').value = usuario.correo || '';
    } catch (error) {
        mostrarMensaje('Error al cargar el perfil: ' + error.message, 'error');
    }
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message ' + tipo;
    messageDiv.style.display = 'block';
    
    if (tipo === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Manejar envío del formulario
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuarioId = obtenerIdUsuario();
    if (!usuarioId) return;

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!nombre || !correo) {
        mostrarMensaje('Por favor, completa todos los campos requeridos', 'error');
        return;
    }

    const usuarioActualizado = {
        nombre: nombre,
        correo: correo
    };

    if (password) {
        usuarioActualizado.password = password;
    }

    try {
        const response = await fetch(`${API_URL}/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el perfil');
        }

        mostrarMensaje('Perfil actualizado correctamente', 'success');
        document.getElementById('password').value = ''; // Limpiar campo de contraseña
    } catch (error) {
        mostrarMensaje('Error al actualizar: ' + error.message, 'error');
    }
});

// Manejar cierre de sesión
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioCorreo');
    alert('Sesión cerrada');
    window.location.href = 'index.html';
});

// Cargar perfil al abrir la página
document.addEventListener('DOMContentLoaded', cargarPerfil);
