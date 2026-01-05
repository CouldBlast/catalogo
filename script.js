/* ======================================================
   TEXTO ROTATIVO DEL BANNER
====================================================== */
const frases = [
  "🔥 Nuevos modelos",
  "🔥 Edición limitada",
  "🔥 Estilo urbano",
  "🔥 Solo aquí"
];

let indiceTexto = 0;
const textoBanner = document.getElementById("texto-rotativo");

if (textoBanner) {
  textoBanner.textContent = frases[indiceTexto];
  setInterval(() => {
    indiceTexto = (indiceTexto + 1) % frases.length;
    textoBanner.textContent = frases[indiceTexto];
  }, 2000);
}

/* ======================================================
   CARGA DE TENIS DESDE JSON
====================================================== */
fetch("productos.json")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("catalogo-tenis");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    productos.forEach((p, i) => {
      contenedor.innerHTML += `
        <div class="producto visible"
             data-categoria="${p.categoria}"
             data-tallas="${p.tallas.join(',')}">
          
          <img src="${p.imagen}" alt="${p.nombre}">
          
          <div class="info">
            <h2>${p.nombre}</h2>
            <p>Q${p.precio}</p>

            <select onchange="cambiarTalla(this, 'talla${i}')">
              <option value="">Verifica disponibilidad</option>
              ${p.tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>

            <div class="talla-seleccionada" id="talla${i}">Talla: --</div>
          </div>
        </div>
      `;
    });
  });

/* ======================================================
   FUNCIÓN MOSTRAR TALLA SELECCIONADA
====================================================== */
function cambiarTalla(select, idTalla) {
  const div = document.getElementById(idTalla);
  if (!div) return;

  div.textContent = select.value
    ? `Talla: ${select.value}`
    : "Talla: --";
}

window.cambiarTalla = cambiarTalla;

/* ======================================================
   FILTRO POR CATEGORÍA + SCROLL
====================================================== */
const botonesFiltro = document.querySelectorAll(".filtro-btn");

botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filtro = btn.dataset.filter;
    const productos = document.querySelectorAll(".producto");

    productos.forEach(prod => {
      const categoria = prod.dataset.categoria;
      prod.style.display =
        filtro === "todos" || categoria === filtro
          ? "block"
          : "none";
    });

    // Scroll automático según filtro
    if (filtro === "gorras") {
      document
        .querySelector(".catalogo-gorras")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      document
        .getElementById("catalogo-tenis")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ======================================================
   BUSCADOR POR TALLA (SOLO TENIS)
====================================================== */
const inputBuscador = document.getElementById("buscador");

if (inputBuscador) {
  inputBuscador.addEventListener("input", () => {
    const valor = inputBuscador.value.trim();

    const productos = document.querySelectorAll(".producto");

    productos.forEach(prod => {
      const tallas = prod.dataset.tallas;

      // Si NO tiene tallas (gorras), se oculta
      if (!tallas) {
        prod.style.display = "none";
        return;
      }

      // Si input vacío, mostrar todos los tenis
      if (valor === "") {
        prod.style.display = "block";
        return;
      }

      prod.style.display = tallas.includes(valor)
        ? "block"
        : "none";
    });

    // Scroll automático al catálogo
    document
      .getElementById("catalogo-tenis")
      ?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ======================================================
   ANIMACIÓN AL APARECER (Intersection Observer)
====================================================== */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".producto").forEach(p => observer.observe(p));
