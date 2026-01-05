// ===== CARGA DE TENIS DESDE JSON =====
fetch('productos.json')
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById('catalogo-tenis');

    productos.forEach((p, i) => {
      contenedor.innerHTML += `
        <div class="producto"
             data-tallas="${p.tallas.join(',')}"
             data-categoria="${p.categoria}">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="info">
            <h2>${p.nombre}</h2>
            <p>Q${p.precio}</p>
            <select onchange="cambiarTalla(this, 'talla${i}')">
              <option value="">Verifica tallas disponibles</option>
              ${p.tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>
            <div class="talla-seleccionada" id="talla${i}">Talla: --</div>
          </div>
        </div>
      `;
    });

    document.querySelectorAll('.producto').forEach(card => io.observe(card));

    // 👇 ACTIVAR FILTROS DESPUÉS DE CREAR LOS TENIS
    activarFiltros();
  });


// ===== FUNCIÓN DE FILTROS (GLOBAL) =====
function activarFiltros() {
  const botones = document.querySelectorAll(".filtro-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {

      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filtro = btn.dataset.filter;

      document.querySelectorAll(".producto").forEach(prod => {
        const categoria = prod.dataset.categoria;

        if (filtro === "todos" || categoria === filtro) {
          prod.style.display = "block";
        } else {
          prod.style.display = "none";
        }
      });
    });
  });
}
