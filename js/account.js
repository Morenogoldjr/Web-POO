const API_BASE = window.location.origin === 'null' ? 'http://localhost:8080' : window.location.origin;
const SESSION_KEY = 'shojoCurrentUser';

function getCurrentUser() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
    if (!user) return;
    const safeUser = {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
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

async function loadAccount() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/usuarios/${currentUser.id}`);
        if (!response.ok) {
            clearCurrentUser();
            window.location.href = 'login.html';
            return;
        }

        const usuario = await response.json();
        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('correo').value = usuario.correo || '';
        setCurrentUser(usuario);
    } catch (error) {
        console.error(error);
        showMessage('accountMessage', 'Error al cargar información de la cuenta.');
    }
}

async function handleAccountUpdate(event) {
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
        window.location.href = 'login.html';
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    if (!nombre || !correo) {
        showMessage('accountMessage', 'Nombre y correo son obligatorios.', 'error');
        return;
    }

    const payload = { nombre, correo };
    if (newPassword) {
        payload.password = newPassword;
    }

    try {
        const response = await fetch(`${API_BASE}/usuarios/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const usuario = await response.json();
            setCurrentUser(usuario);
            showMessage('accountMessage', 'Cuenta actualizada correctamente.', 'success');
            document.getElementById('newPassword').value = '';
            return;
        }

        if (response.status === 409) {
            showMessage('accountMessage', 'El correo ya está en uso por otro usuario.', 'error');
            return;
        }

        showMessage('accountMessage', 'No se pudo actualizar la cuenta.', 'error');
    } catch (error) {
        console.error(error);
        showMessage('accountMessage', 'Error de conexión con el servidor.', 'error');
    }
}

function handleLogout() {
    clearCurrentUser();
    window.location.href = 'login.html';
}

function initAccountPage() {
    const accountForm = document.getElementById('accountForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!getCurrentUser()) {
        window.location.href = 'login.html';
        return;
    }

    if (accountForm) {
        accountForm.addEventListener('submit', handleAccountUpdate);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    loadAccount();
}

document.addEventListener('DOMContentLoaded', initAccountPage);
