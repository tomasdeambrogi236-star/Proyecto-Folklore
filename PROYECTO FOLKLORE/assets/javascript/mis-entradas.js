document.addEventListener('DOMContentLoaded', () => {
  renderizarHistorialEntradas();
});

function renderizarHistorialEntradas() {
  const historial = JSON.parse(localStorage.getItem('misEntradas')) || [];
  const seccionVacia = document.getElementById('seccionVacia');
  const seccionEntradas = document.getElementById('seccionEntradas');
  const listaEntradas = document.getElementById('listaEntradas');
  const contador = document.getElementById('contador-entradas');

  contador.textContent = `(${historial.length})`;

  if (historial.length === 0) {
    seccionVacia.style.display = 'block';
    seccionEntradas.style.display = 'none';
    return;
  }

  seccionVacia.style.display = 'none';
  seccionEntradas.style.display = 'flex';
  listaEntradas.innerHTML = '';

  // Invertimos para mostrar la compra más reciente primero
  historial.reverse().forEach(entrada => {
    const card = document.createElement('div');
    card.className = 'entrada-historial-card';
    
    // Convertimos el objeto en un string seguro para pasarlo al onclick
    const entradaData = encodeURIComponent(JSON.stringify(entrada));

    card.innerHTML = `
      <div class="entrada-card-header">
        <span class="comprobante-txt">COMPROBANTE ${entrada.factura}</span>
        <span class="sector-badge">${entrada.sector.split(' ')[0]}</span>
      </div>
      <h3 class="entrada-card-titulo">${entrada.titulo}</h3>
      
      <div class="entrada-card-detalles">
        <p>📅 ${entrada.fechaEvento}</p>
        <p>📍 ${entrada.lugar} - Butacas: ${entrada.butacas}</p>
        <p>💳 Pagado Contado Efectivo: ${entrada.total}</p>
      </div>

      <button class="btn-ver-factura" onclick="abrirFactura('${entradaData}')">
        👁 Ver Entrada / Factura
      </button>
    `;
    listaEntradas.appendChild(card);
  });
}

function abrirFactura(entradaDataCodificada) {
  const entrada = JSON.parse(decodeURIComponent(entradaDataCodificada));
  
  // Llenamos el modal con los datos
  document.getElementById('modal-titulo').textContent = entrada.titulo;
  document.getElementById('modal-factura').textContent = entrada.factura;
  document.getElementById('modal-lugar').textContent = entrada.lugar;
  document.getElementById('modal-sector').textContent = entrada.sector;
  document.getElementById('modal-butacas').textContent = entrada.butacas;
  document.getElementById('modal-total').textContent = entrada.total;
  document.getElementById('modal-emision').textContent = entrada.fechaEmision;
  
  // ¡CORRECCIÓN!: Usamos "usuarioActivo" para mostrar los datos de la persona real
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if(usuario) {
    document.getElementById('modal-cliente').textContent = `${usuario.nombre} - DNI: ${usuario.dni}`;
  } else {
    document.getElementById('modal-cliente').textContent = `Consumidor Final`;
  }

  // Mostramos el modal
  document.getElementById('modalFactura').style.display = 'flex';
}

function cerrarFactura() {
  document.getElementById('modalFactura').style.display = 'none';
}