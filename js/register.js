// API base URL
const API_URL = 'http://localhost:8080/usuarios';

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensaje;
    messageDiv.className = 'message ' + tipo;
    messageDiv.style.display = 'block';
}

// Manejar envío del formulario de registro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validaciones
    if (!nombre || !correo || !password || !confirmPassword) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    if (password.length < 8) {
        mostrarMensaje('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    if (password !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        password: password
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }

        const usuarioRegistrado = await response.json();
        
        // Guardar ID del usuario en localStorage
        localStorage.setItem('usuarioId', usuarioRegistrado.id);
        localStorage.setItem('usuarioCorreo', usuarioRegistrado.correo);
        
        mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
        
        // Redirigir al perfil después de 2 segundos
        setTimeout(() => {
            window.location.href = 'perfil.html';
        }, 2000);
    } catch (error) {
        mostrarMensaje('Error al registrar: ' + error.message, 'error');
    }
});
