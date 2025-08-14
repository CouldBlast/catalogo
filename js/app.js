function filtrarTalla() {
  const talla = document.getElementById('talla').value;
  const productos = document.querySelectorAll('.producto');

  productos.forEach(producto => {
    const tallaProducto = producto.getAttribute('data-talla');
    if (talla === 'todas' || tallaProducto === talla) {
      producto.classList.remove('oculto');
    } else {
      producto.classList.add('oculto');
    }
  });
}

document.getElementById('talla').addEventListener('change', filtrarTalla);
