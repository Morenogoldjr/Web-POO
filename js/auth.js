const API_BASE = window.location.origin === 'null' ? 'http://localhost:8080' : window.location.origin;
const SESSION_KEY = 'shojoCurrentUser';

function getCurrentUser() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
    if (user) {
        const safeUser = {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    }
}

function clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
}

function showMessage(id, message, type = 'error') {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.className = `message ${type}`;
}

async function handleRegister(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!nombre || !correo || !password || !confirmPassword) {
        showMessage('authMessage', 'Completa todos los campos.');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('authMessage', 'Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, password })
        });

        if (response.status === 201) {
            const usuario = await response.json();
            setCurrentUser(usuario);
            window.location.href = 'cuenta.html';
            return;
        }

        if (response.status === 409) {
            showMessage('authMessage', 'Este correo ya está registrado.');
            return;
        }

        showMessage('authMessage', 'No se pudo crear la cuenta. Intenta nuevamente.');
    } catch (error) {
        console.error(error);
        showMessage('authMessage', 'Error de conexión con el servidor.');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    if (!correo || !password) {
        showMessage('authMessage', 'Ingresa correo y contraseña.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        });

        if (response.ok) {
            const usuario = await response.json();
            setCurrentUser(usuario);
            window.location.href = 'cuenta.html';
            return;
        }

        if (response.status === 401) {
            showMessage('authMessage', 'Correo o contraseña incorrectos.');
            return;
        }

        showMessage('authMessage', 'No se pudo iniciar sesión. Intenta de nuevo.');
    } catch (error) {
        console.error(error);
        showMessage('authMessage', 'Error de conexión con el servidor.');
    }
}

function initAuthForms() {
    const currentUser = getCurrentUser();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (currentUser && window.location.pathname.endsWith('login.html')) {
        window.location.href = 'cuenta.html';
        return;
    }

    if (currentUser && window.location.pathname.endsWith('register.html')) {
        window.location.href = 'cuenta.html';
        return;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

document.addEventListener('DOMContentLoaded', initAuthForms);
