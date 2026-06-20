/**
 * RAÍCES TICKETS — Módulo del Menú Principal
 * Muestra el contenido del menú según el usuario logueado
 */

// ────────────────────────────────────────────────────────────────
// Base de datos de las Noches (Datos extraídos de tus capturas)
// ────────────────────────────────────────────────────────────────
const NOCHES_FESTIVAL = [
  { 
    id: "1", 
    mes: "NOV", dia: "20", 
    titulo: "Noche 1: Gran Apertura", 
    estadoTag: "DESCUENTO ANTICIPADA", tagClase: "tag-exito",
    artistas: "Los Nocheros • Soledad Pastorutti • Destino San Javier",
    horario: "Inicio: 20:00 hs - Sin horario de fin", 
    precio: "12.000" 
  },
  { 
    id: "2", 
    mes: "NOV", dia: "21", 
    titulo: "Noche 2: Pura Tradición", 
    estadoTag: "DESCUENTO ANTICIPADA", tagClase: "tag-exito",
    artistas: "Chaqueño Palavecino • Jorge Rojas • Ahyre",
    horario: "Inicio: 20:00 hs - Sin horario de fin", 
    precio: "15.000" 
  },
  { 
    id: "3", 
    mes: "NOV", dia: "22", 
    titulo: "Noche 3: Voces Jóvenes", 
    estadoTag: "DESCUENTO ANTICIPADA", tagClase: "tag-exito",
    artistas: "Abel Pintos • Nahuel Pennisi • Canto 4",
    horario: "Inicio: 20:00 hs - Sin horario de fin", 
    precio: "18.000" 
  },
  { 
    id: "4", 
    mes: "NOV", dia: "23", 
    titulo: "Noche 4: Fiesta Norteña", 
    estadoTag: "DESCUENTO ANTICIPADA", tagClase: "tag-exito",
    artistas: "Los Tekis • Sergio Galleguillo • Guitarreros",
    horario: "Inicio: 21:00 hs - Sin horario de fin", 
    precio: "12.000" 
  },
  { 
    id: "5", 
    mes: "NOV", dia: "24", 
    titulo: "Noche 5: Cierre de Oro", 
    estadoTag: "ÚLTIMAS BUTACAS", tagClase: "tag-alerta",
    artistas: "Dúo Coplanacu • Raly Barrionuevo • Peteco Carabajal",
    horario: "Inicio: 21:00 hs - Sin horario de fin", 
    precio: "15.000" 
  }
];

// ────────────────────────────────────────────────────────────────
// Inicialización del DOM y Controladores de Eventos
// ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderizarGrilla('todas'); // Render inicial muestra todo
  configurarFiltros();
});

function configurarFiltros() {
  const botonesFiltro = document.querySelectorAll('.filtro-pill');
  
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (e) => {
      // Remover clase activa de todos los botones
      botonesFiltro.forEach(btn => btn.classList.remove('active'));
      // Agregar activa al botón cliqueado
      e.target.classList.add('active');
      
      // Filtrar y volver a renderizar
      const filtroSeleccionado = e.target.getAttribute('data-filtro');
      renderizarGrilla(filtroSeleccionado);
    });
  });
}

function renderizarGrilla(filtro) {
  const contenedor = document.getElementById('nochesContainer');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // Filtrar el array según la píldora activa
  const nochesFiltradas = NOCHES_FESTIVAL.filter(noche => {
    if (filtro === 'todas') return true;
    if (filtro === '4-5') return noche.id === '4' || noche.id === '5';
    return noche.id === filtro;
  });

  // Crear las tarjetas con la estructura vertical exacta de la foto
  nochesFiltradas.forEach(noche => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'presentacion-card';
    tarjeta.innerHTML = `
      <div class="card-header-row">
        <div class="card-badge-fecha">
          <span class="fecha-mes">${noche.mes}</span>
          <span class="fecha-dia">${noche.dia}</span>
        </div>
        <div class="card-header-info">
          <h3 class="card-noche-titulo">${noche.titulo}</h3>
          <span class="status-pill-tag ${noche.tagClase}">${noche.estadoTag}</span>
        </div>
      </div>

      <div class="card-cuerpo-artistas">
        <span class="artistas-label">ARTISTAS CONFIRMADOS</span>
        <p class="artistas-lista">${noche.artistas}</p>
      </div>

      <div class="card-reloj-bar">
        <span class="icono-reloj">🕒</span>
        <span class="reloj-texto">${noche.horario}</span>
      </div>

      <div class="card-footer-row">
        <div class="precio-bloque">
          <span class="precio-label">DESDE</span>
          <span class="precio-monto">$ ${noche.precio}</span>
        </div>
        <button class="btn-seleccionar-butaca" onclick="irA('reserva', '${noche.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;">
            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
            <path d="M16 8h.01M12 8h.01M8 8h.01M16 12h.01M12 12h.01M8 12h.01"></path>
          </svg>
          Seleccionar Butaca y reservar
        </button>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

// ──────────────────────────────────────────────
// INICIALIZACIÓN
// ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  // Verificar sesión activa
  requiereLogin();

  const usuario = obtenerSesion();
  if (!usuario) return;

  // Actualizar nombre en navbar
  const navNombre = document.getElementById('nombreUsuarioNav');
  if (navNombre) {
    navNombre.textContent = usuario.nombre.split(' ')[0]; // Solo primer nombre
  }

  // Mostrar cards según rol
  configurarCardsPorRol(usuario.rol);

  // Renderizar noches del festival
  renderizarNoches();
});

// ──────────────────────────────────────────────
// CONFIGURACIÓN POR ROL
// ──────────────────────────────────────────────

function configurarCardsPorRol(rol) {
  const cardAdmin    = document.getElementById('cardAdmin');
  const cardVendedor = document.getElementById('cardVendedor');

  if (rol === 'admin') {
    if (cardAdmin)    cardAdmin.style.display    = 'block';
    if (cardVendedor) cardVendedor.style.display = 'block';
  } else if (rol === 'vendedor') {
    if (cardVendedor) cardVendedor.style.display = 'block';
  }
  // rol 'usuario' → solo ve las cards estándar
}

// ──────────────────────────────────────────────────────────────
// MODIFICACIÓN: Redirección real al módulo de reserva
// ──────────────────────────────────────────────────────────────
function irA(modulo, numNoche = null) {
  if (modulo === 'reserva') {
    // Si pasamos numNoche, lo enviamos por URL
    const url = numNoche ? `reserva.html?noche=${numNoche}` : 'reserva.html';
    window.location.href = url;
    return;
  }

  // Mantener lógica para otras rutas (admin, ventas, etc.)
  const RUTAS_MODULOS = {
    compra:     'compra.html',
    cartelera:  'cartelera.html',
    butacas:    'butacas.html',
    misEntradas:'mis-entradas.html',
    admin:      'admin.html',
    ventas:     'ventas.html',
    acceso:     'acceso.html',
  };

  if (RUTAS_MODULOS[modulo]) {
    window.location.href = RUTAS_MODULOS[modulo];
  } else {
    console.error("Módulo no encontrado:", modulo);
  }
}

// ──────────────────────────────────────────────
// MODAL CIERRE DE SESIÓN
// ──────────────────────────────────────────────
function abrirModalCierreSesion() {
  const modal = document.getElementById('modalCierreSesion');
  if (modal) modal.style.display = 'flex'; // Lo muestra centrado
}

function cerrarModal() {
  const modal = document.getElementById('modalCierreSesion');
  if (modal) modal.style.display = 'none'; // Lo vuelve a ocultar
}

function confirmarCierreSesion() {
  cerrarModal();
  cerrarSesion(); // Esta función ya está en tu autenticacion.js
}
// Cerrar modal al click fuera
document.addEventListener('click', function (e) {
  const modal = document.getElementById('modalCierreSesion');
  if (modal && e.target === modal) {
    cerrarModal();
  }
});
