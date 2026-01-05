// ================= TEXTO ROTATIVO DEL BANNER =================
const frases = [
  "🔥 Nuevos modelos",
  "🔥 Edición limitada",
  "🔥 Estilo urbano",
  "🔥 Solo aquí"
];

let i = 0;
const texto = document.getElementById("texto-rotativo");

if (texto) {
  texto.textContent = frases[0];
  setInterval(() => {
    i = (i + 1) % frases.length;
    texto.textContent = frases[i];
  }, 2000);
}

// ================= CARGA DE PRODUCTOS (TENIS) =================
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("catalogo-tenis");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    data.forEach((p, i) => {
      contenedor.innerHTML += `
        <div class="producto"
             data-categoria="${p.categoria}"
             data-tallas="${p.tallas.join(',')}">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="info">
            <h2>${p.nombre}</h2>
            <p>Q${p.precio}</p>
            <select onchange="cambiarTalla(this,'talla${i}')">
              <option value="">Verifica disponibilidad</option>
              ${p.tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>
            <div class="talla-seleccionada" id="talla${i}">Talla: --</div>
          </div>
        </div>
      `;
    });

    activarFiltros();
    activarObserver();
  });

// ================= FILTROS POR CATEGORÍA =================
function activarFiltros() {
  const botones = document.querySelectorAll(".filtro-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filtro = btn.dataset.filter;

      document.querySelectorAll(".producto").forEach(prod => {
        const cat = prod.dataset.categoria;
        prod.style.display =
          filtro === "todos" || cat === filtro ? "block" : "none";
      });
    });
  });
}

// ================= BUSCADOR POR TALLA =================
const buscador = document.getElementById("buscador");
const errorTalla = document.getElementById("errorTalla");

if (buscador) {
  buscador.addEventListener("input", () => {
    const valor = buscador.value.trim();

    if (!/^\d*$/.test(valor)) {
      errorTalla.textContent = "Solo números";
      return;
    }

    errorTalla.textContent = "";

    document.querySelectorAll(".producto").forEach(p => {
      const tallas = p.dataset.tallas || "";
      p.style.display =
        valor === "" || tallas.includes(valor) ? "block" : "none";
    });
  });
}

// ================= MOSTRAR TALLA =================
function cambiarTalla(select, id) {
  const div = document.getElementById(id);
  if (div) div.textContent = select.value ? "Talla: " + select.value : "Talla: --";
}
window.cambiarTalla = cambiarTalla;

// ================= ANIMACIÓN AL SCROLL =================
function activarObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".producto").forEach(p => io.observe(p));
}

