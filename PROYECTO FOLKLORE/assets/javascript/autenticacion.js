/**
 * RAÍCES TICKETS — Módulo de Autenticación
 * Maneja login, registro y sesión de usuario (prototipo)
 */

// ──────────────────────────────────────────────
// Usuarios de ejemplo para el prototipo
// En producción esto se reemplaza por llamadas a la BD
// ──────────────────────────────────────────────
const USUARIOS_PROTOTIPO = [
  {
    email: 'admin@folklore.com',
    password: 'admin123',
    nombre: 'Admin Sistema',
    dni: '20000001',
    telefono: '2664000001',
    rol: 'admin'
  },
  {
    email: 'vendedor@folklore.com',
    password: 'vend123',
    nombre: 'Carlos Vendedor',
    dni: '20000002',
    telefono: '2664000002',
    rol: 'vendedor'
  },
  {
    email: 'usuario@folklore.com',
    password: 'user123',
    nombre: 'Martina García',
    dni: '41234567',
    telefono: '2664123456',
    rol: 'usuario'
  }
];

// ──────────────────────────────────────────────
// UTILIDADES
// ──────────────────────────────────────────────

/**
 * Muestra u oculta un mensaje de error junto a un campo
 * @param {string} idCampo  - id del input
 * @param {string} idError  - id del span de error
 * @param {boolean} mostrar - true = mostrar, false = ocultar
 */
function toggleError(idCampo, idError, mostrar) {
  const campo = document.getElementById(idCampo);
  const msg   = document.getElementById(idError);
  if (!campo || !msg) return;

  if (mostrar) {
    campo.classList.add('error-campo');
    msg.classList.add('visible');
  } else {
    campo.classList.remove('error-campo');
    msg.classList.remove('visible');
  }
}

/** Validación básica de email */
function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Guarda el usuario en sessionStorage (simula sesión activa) */
function guardarSesion(usuario) {
  sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

/** Obtiene el usuario de la sesión activa */
function obtenerSesion() {
  const datos = sessionStorage.getItem('usuarioActivo');
  return datos ? JSON.parse(datos) : null;
}

/** Cierra la sesión y redirige al login */
function cerrarSesion() {
  sessionStorage.removeItem('usuarioActivo');
  window.location.href = 'login.html';
}

// ──────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────

function manejarLogin() {
  const email    = document.getElementById('emailLogin')?.value.trim() || '';
  const password = document.getElementById('passwordLogin')?.value      || '';
  let hayError   = false;

  // Validar email
  if (!esEmailValido(email)) {
    toggleError('emailLogin', 'errorEmailLogin', true);
    hayError = true;
  } else {
    toggleError('emailLogin', 'errorEmailLogin', false);
  }

  // Validar contraseña
  if (!password) {
    toggleError('passwordLogin', 'errorPasswordLogin', true);
    hayError = true;
  } else {
    toggleError('passwordLogin', 'errorPasswordLogin', false);
  }

  if (hayError) return;

  // Buscar usuario en el prototipo
  // También revisa usuarios registrados durante la sesión
  const registrados  = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
  const todosUsuarios = [...USUARIOS_PROTOTIPO, ...registrados];

  const usuarioEncontrado = todosUsuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  const alertaEl = document.getElementById('alertaLogin');

  if (usuarioEncontrado) {
    alertaEl?.classList.remove('visible');
    guardarSesion(usuarioEncontrado);
    window.location.href = 'menu.html';
  } else {
    alertaEl?.classList.add('visible');
  }
}

// ──────────────────────────────────────────────
// REGISTRO
// ──────────────────────────────────────────────

function toggleBotonRegistro() {
  const check = document.getElementById('checkTerminos');
  const btn   = document.getElementById('btnRegistrarse');
  if (check && btn) {
    btn.disabled = !check.checked;
  }
}

function manejarRegistro() {
  const nombre    = document.getElementById('nombreCompleto')?.value.trim()   || '';
  const dni       = document.getElementById('dniRegistro')?.value.trim()       || '';
  const telefono  = document.getElementById('telefonoRegistro')?.value.trim()  || '';
  const email     = document.getElementById('emailRegistro')?.value.trim()     || '';
  const password  = document.getElementById('passwordRegistro')?.value         || '';
  let hayError    = false;

  // Nombre
  if (nombre.length < 3) {
    toggleError('nombreCompleto', 'errorNombre', true);
    hayError = true;
  } else {
    toggleError('nombreCompleto', 'errorNombre', false);
  }

  // DNI (7-8 dígitos)
  if (!/^\d{7,8}$/.test(dni)) {
    toggleError('dniRegistro', 'errorDni', true);
    hayError = true;
  } else {
    toggleError('dniRegistro', 'errorDni', false);
  }

  // Teléfono (al menos 8 dígitos)
  if (!/^\d{8,15}$/.test(telefono)) {
    toggleError('telefonoRegistro', 'errorTelefono', true);
    hayError = true;
  } else {
    toggleError('telefonoRegistro', 'errorTelefono', false);
  }

  // Email
  if (!esEmailValido(email)) {
    toggleError('emailRegistro', 'errorEmailReg', true);
    hayError = true;
  } else {
    toggleError('emailRegistro', 'errorEmailReg', false);
  }

  // Contraseña
  if (password.length < 8) {
    toggleError('passwordRegistro', 'errorPassword', true);
    hayError = true;
  } else {
    toggleError('passwordRegistro', 'errorPassword', false);
  }

  if (hayError) return;

  // Comprobar si el email ya existe
  const registrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
  const todos       = [...USUARIOS_PROTOTIPO, ...registrados];
  const yaExiste    = todos.some(u => u.email.toLowerCase() === email.toLowerCase());

  const alertaEl = document.getElementById('alertaRegistro');

  if (yaExiste) {
    alertaEl.textContent = 'Ese correo ya está registrado. Probá con otro.';
    alertaEl.classList.add('visible');
    return;
  }

  alertaEl?.classList.remove('visible');

  // Guardar nuevo usuario
  const nuevoUsuario = { nombre, dni, telefono, email, password, rol: 'usuario' };
  registrados.push(nuevoUsuario);
  localStorage.setItem('usuariosRegistrados', JSON.stringify(registrados));

  // Iniciar sesión automáticamente
  guardarSesion(nuevoUsuario);
  window.location.href = 'menu.html';
}

// ──────────────────────────────────────────────
// PROTECCIÓN DE PÁGINAS
// Llamar al inicio de páginas que requieren login
// ──────────────────────────────────────────────

function requiereLogin() {
  if (!obtenerSesion()) {
    window.location.href = 'login.html';
  }
}

// ──────────────────────────────────────────────
// ACTUALIZAR NAVBAR GLOBAL
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // AHORA SÍ: Buscamos en sessionStorage
  const datosSesion = sessionStorage.getItem('usuarioLogueado') || sessionStorage.getItem('usuarioActivo');
  
  if (datosSesion) {
    const usuario = JSON.parse(datosSesion);
    const navName = document.getElementById('nav-user-name');
    const navAvatar = document.getElementById('nav-user-avatar');
    
    if (navName) navName.textContent = usuario.nombre;
    if (navAvatar) navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
  }
});