// ──────────────────────────────────────────────
// ESTADO GLOBAL DE LA RESERVA
// ──────────────────────────────────────────────
let sectorActual = null;
let precioSector = 0;
let butacasSeleccionadas = [];
const LIMITE_BUTACAS = 4;

// ──────────────────────────────────────────────
// PASO 1: SELECCIÓN
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mostrar la noche correcta según la URL
  const params = new URLSearchParams(window.location.search);
  const nocheNum = params.get('noche'); 
  
  if (nocheNum) {
    const tituloNocheEl = document.querySelector('.reserva-info-noche h1');
    if(tituloNocheEl) tituloNocheEl.textContent = `Noche ${nocheNum}: Gran Apertura`;
  }

  // AHORA SÍ: Buscamos en sessionStorage
  const datosSesion = sessionStorage.getItem('usuarioLogueado') || sessionStorage.getItem('usuarioActivo');
  
  if (datosSesion) {
    const usuario = JSON.parse(datosSesion);

    const checkoutNombre = document.getElementById('checkout-nombre');
    const checkoutDni = document.getElementById('checkout-dni');
    if (checkoutNombre) checkoutNombre.textContent = usuario.nombre;
    if (checkoutDni) checkoutDni.textContent = usuario.dni || 'Sin DNI';

    const ticketCliente = document.getElementById('ticket-cliente');
    if (ticketCliente) ticketCliente.textContent = `${usuario.nombre} - DNI: ${usuario.dni || 'S/N'}`;
    
  } else {
    const checkoutNombre = document.getElementById('checkout-nombre');
    const checkoutDni = document.getElementById('checkout-dni');
    if (checkoutNombre) checkoutNombre.textContent = 'Consumidor Final';
    if (checkoutDni) checkoutDni.textContent = '00.000.000';
  }
});

function seleccionarSector(letraSector, precio) {
  sectorActual = letraSector;
  precioSector = precio;
  butacasSeleccionadas = []; // Reiniciamos selección al cambiar de sector

  // 1. Limpiar UI de clases activas
  document.querySelectorAll('.sector-card').forEach(card => card.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // 2. CORRECCIÓN: Actualizar el subtítulo del bloque 2
  const subtitulo = document.querySelector('.subtitulo-bloque');
  subtitulo.textContent = `Sector ${letraSector} - Fila 1 a 4. Límite: 4 butacas.`;

  // 3. Renderizar mapa y limpiar resumen
  document.getElementById('bloque-mapa').style.display = 'block';
  renderizarMapaButacas();
  actualizarResumen();
}

function renderizarMapaButacas() {
  const grilla = document.getElementById('grilla-butacas');
  grilla.innerHTML = '';

  for (let f = 1; f <= 4; f++) {
    const filaDiv = document.createElement('div');
    filaDiv.className = 'fila-butacas';
    
    // Cambiamos a DOM puro para los labels
    const labelIzq = document.createElement('span');
    labelIzq.className = 'fila-label';
    labelIzq.textContent = `F${f}`;
    filaDiv.appendChild(labelIzq);
    
    for (let b = 1; b <= 8; b++) {
      const idButaca = `${sectorActual}-F${f}-B${b}`;
      const butacaEl = document.createElement('div');
      butacaEl.className = 'butaca';
      butacaEl.textContent = b;
      
      // Verificamos si ya estaba seleccionada para mantener el estado al redibujar
      if (butacasSeleccionadas.includes(idButaca)) {
        butacaEl.classList.add('selected');
      }

      butacaEl.onclick = () => toggleButaca(idButaca, butacaEl);
      filaDiv.appendChild(butacaEl);
    }
    
    const labelDer = document.createElement('span');
    labelDer.className = 'fila-label';
    labelDer.textContent = `F${f}`;
    filaDiv.appendChild(labelDer);
    
    grilla.appendChild(filaDiv);
  }
}

function toggleButaca(idButaca, elementoDOM) {
  const index = butacasSeleccionadas.indexOf(idButaca);
  
  if (index > -1) {
    // Deseleccionar
    butacasSeleccionadas.splice(index, 1);
    elementoDOM.classList.remove('selected');
  } else {
    // Seleccionar (validar límite)
    if (butacasSeleccionadas.length >= LIMITE_BUTACAS) {
      alert(`El límite es de ${LIMITE_BUTACAS} butacas por compra.`);
      return;
    }
    butacasSeleccionadas.push(idButaca);
    elementoDOM.classList.add('selected');
  }
  
  actualizarResumen();
}

function actualizarResumen() {
  const vacioUI = document.getElementById('resumen-vacio');
  const llenoUI = document.getElementById('resumen-lleno');
  const listaUI = document.getElementById('lista-resumen');
  
  if (butacasSeleccionadas.length === 0) {
    vacioUI.style.display = 'block';
    llenoUI.style.display = 'none';
    return;
  }

  vacioUI.style.display = 'none';
  llenoUI.style.display = 'block';
  
  // Llenar lista
  listaUI.innerHTML = '';
  butacasSeleccionadas.forEach(id => {
    listaUI.innerHTML += `
      <li class="item-butaca-resumen">
        <span><span class="dot">●</span> ${id}</span>
        <span>$ ${precioSector.toLocaleString('es-AR')}</span>
      </li>
    `;
  });

  // Cálculos
  const subtotal = butacasSeleccionadas.length * precioSector;
  const descuento = subtotal * 0.10; // 10% anticipada
  const total = subtotal - descuento;

  document.getElementById('txt-subtotal').textContent = `Subtotal (${butacasSeleccionadas.length} entradas)`;
  document.getElementById('monto-subtotal').textContent = `$ ${subtotal.toLocaleString('es-AR')}`;
  document.getElementById('monto-descuento').textContent = `- $ ${descuento.toLocaleString('es-AR')}`;
  document.getElementById('monto-total').textContent = `$ ${total.toLocaleString('es-AR')}`;
}

// ──────────────────────────────────────────────
// NAVEGACIÓN Y PASO 2 / PASO 3
// ──────────────────────────────────────────────
function irAPaso2() {
  // Llenar datos de Checkout
  const stringButacas = butacasSeleccionadas.join(', ');
  const descSector = sectorActual === 'A' ? '(Platea VIP)' : sectorActual === 'B' ? '(Platea Media)' : '(General)';
  const totalStr = document.getElementById('monto-total').textContent;

  document.getElementById('checkout-butacas').textContent = stringButacas;
  document.getElementById('checkout-sector').textContent = `Mayores - Sector ${sectorActual} ${descSector}`;
  document.getElementById('checkout-monto-total').textContent = totalStr;

  document.getElementById('paso-1-seleccion').style.display = 'none';
  document.getElementById('paso-2-checkout').style.display = 'block';
  window.scrollTo(0,0);
}

function volverAPaso1() {
  document.getElementById('paso-2-checkout').style.display = 'none';
  document.getElementById('paso-1-seleccion').style.display = 'block';
}

function irAPaso3() {
  // Transferir datos al ticket
  document.getElementById('ticket-sector').textContent = document.getElementById('checkout-sector').textContent;
  document.getElementById('ticket-butacas').textContent = document.getElementById('checkout-butacas').textContent;
  document.getElementById('ticket-monto-total').textContent = document.getElementById('checkout-monto-total').textContent;
  guardarEntradaEnHistorial();
  document.getElementById('paso-2-checkout').style.display = 'none';
  document.getElementById('paso-3-exito').style.display = 'block';
  window.scrollTo(0,0);
}
// Al cargar la página de reserva, detectamos qué noche viene en la URL
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const nocheId = params.get('noche');
  
  if (nocheId) {
    console.log("Cargando detalles para la Noche:", nocheId);
    // Aquí puedes llamar a una función que busque los datos de esa noche
    // y los inyecte en el HTML del Paso 1
    cargarDatosNoche(nocheId);
  }
});

function cargarDatosNoche(id) {
  // Lógica para actualizar los títulos y precios según el ID recibido
}
function guardarEntradaEnHistorial() {
  // Obtenemos los datos actuales de la UI de reserva
  const sectorSeleccionado = document.getElementById('checkout-sector') ? document.getElementById('checkout-sector').textContent : 'Sector Seleccionado';
  const butacasSeleccionadas = document.getElementById('checkout-butacas') ? document.getElementById('checkout-butacas').textContent : 'No especificadas';
  const totalAbonado = document.getElementById('checkout-monto-total') ? document.getElementById('checkout-monto-total').textContent : '$0';
  const tituloNoche = document.querySelector('.reserva-info-noche h1') ? document.querySelector('.reserva-info-noche h1').textContent : 'Noche de Festival';

  // Creamos un objeto con los datos de la nueva entrada
  const nuevaEntrada = {
    id: Date.now().toString(),
    factura: 'FAC-' + Math.floor(Math.random() * 900000 + 100000), // Genera un número aleatorio
    titulo: tituloNoche,
    fechaEvento: 'Viernes 20 de Noviembre', // Puedes hacerlo dinámico después
    lugar: 'Único Estadio Municipal',
    sector: sectorSeleccionado,
    butacas: butacasSeleccionadas,
    total: totalAbonado,
    fechaEmision: new Date().toLocaleString('es-AR')
  };

  // Traemos las entradas anteriores (si hay) y agregamos la nueva
  let historial = JSON.parse(localStorage.getItem('misEntradas')) || [];
  historial.push(nuevaEntrada);
  localStorage.setItem('misEntradas', JSON.stringify(historial));
}
function obtenerButacasOcupadas(tituloNoche, sector) {
  // Leemos TODAS las entradas vendidas (simulando la base de datos)
  // Nota: Si actualmente guardas todo en 'misEntradas', usa ese key por ahora.
  const todasLasEntradas = JSON.parse(localStorage.getItem('misEntradas')) || [];

  let asientosOcupados = [];

  // Filtramos las entradas de la noche y sector que el usuario está mirando
  todasLasEntradas.forEach(entrada => {
    if (entrada.titulo === tituloNoche && entrada.sector === sector) {
      // Supongamos que entrada.butacas es un texto como "A1, A2, A3"
      // Lo separamos por comas y limpiamos los espacios
      const lista = entrada.butacas.split(',').map(asiento => asiento.trim());
      asientosOcupados = asientosOcupados.concat(lista);
    }
  });

  return asientosOcupados; // Devuelve un array ej: ["A1", "A2", "B5"]
}
function actualizarMapaButacas(tituloNoche, sector) {
  const ocupadas = obtenerButacasOcupadas(tituloNoche, sector);
  const elementosButaca = document.querySelectorAll('.butaca');

  elementosButaca.forEach(boton => {
    const numeroAsiento = boton.getAttribute('data-numero');

    // Si el número de este botón está en la lista de ocupadas...
    if (ocupadas.includes(numeroAsiento)) {
      boton.classList.add('butaca-ocupada');
      boton.classList.remove('butaca-disponible');
      boton.disabled = true; // Evita que le hagan clic
    } else {
      boton.classList.remove('butaca-ocupada');
      boton.classList.add('butaca-disponible');
      boton.disabled = false;
    }
  });
}
