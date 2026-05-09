// API base URL
const API_URL = 'http://localhost:8080/usuarios';

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message ' + tipo;
    messageDiv.style.display = 'block';
}

// Manejar envío del formulario de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    if (!correo || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/email/${correo}`);
        
        if (!response.ok) {
            mostrarMensaje('Correo o contraseña incorrectos', 'error');
            return;
        }

        const usuario = await response.json();

        // Validar contraseña (en producción, esto debería hacerse en el backend)
        if (usuario.password !== password) {
            mostrarMensaje('Correo o contraseña incorrectos', 'error');
            return;
        }

        // Guardar ID y correo del usuario en localStorage
        localStorage.setItem('usuarioId', usuario.id);
        localStorage.setItem('usuarioCorreo', usuario.correo);
        
        mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
        
        // Redirigir al perfil después de 1.5 segundos
        setTimeout(() => {
            window.location.href = 'perfil.html';
        }, 1500);
    } catch (error) {
        mostrarMensaje('Error al iniciar sesión: ' + error.message, 'error');
    }
});
