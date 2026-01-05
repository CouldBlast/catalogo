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
   OBSERVER (se usa luego del fetch)
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
        <div class="producto"
             data-categoria="${p.categoria}"
             data-tallas="${p.tallas?.join(",") || ""}">
          
          <img src="${p.imagen}" alt="${p.nombre}">
          
          <div class="info">
            <h2>${p.nombre}</h2>
            <p>Q${p.precio}</p>

            <select onchange="cambiarTalla(this, 'talla${i}')">
              <option value="">Verifica disponibilidad</option>
              ${p.tallas
                ? p.tallas.map(t => `<option value="${t}">${t}</option>`).join("")
                : `<option value="Unitalla">Unitalla</option>`}
            </select>

            <div class="talla-seleccionada" id="talla${i}">Talla: --</div>
          </div>
        </div>
      `;
    });

    // 👇 OBSERVAR PRODUCTOS DESPUÉS DE CREARLOS
    document.querySelectorAll(".producto").forEach(p => observer.observe(p));
  });

/* ======================================================
   MOSTRAR TALLA SELECCIONADA
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

    // Scroll automático
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
   BUSCADOR POR TALLA (VALIDADO + SIN SCROLL PREMATURO)
====================================================== */
const inputBuscador = document.getElementById("buscador");
const mensajeError = document.getElementById("errorTalla"); // crea este div en HTML

if (inputBuscador) {
  inputBuscador.addEventListener("input", () => {
    let valor = inputBuscador.value.trim();
    const productos = document.querySelectorAll(".producto");
    let hayResultados = false;

    // 🔴 No permitir letras
    if (!/^\d*$/.test(valor)) {
      inputBuscador.value = valor.replace(/\D/g, "");
      return;
    }

    // Limpiar mensaje
    if (mensajeError) mensajeError.textContent = "";

    productos.forEach(prod => {
      const tallas = prod.dataset.tallas;

      // Gorras no participan
      if (!tallas) {
        prod.style.display = "none";
        return;
      }

      // Mostrar todo si input vacío
      if (valor === "") {
        prod.style.display = "block";
        return;
      }

      if (tallas.split(",").includes(valor)) {
        prod.style.display = "block";
        hayResultados = true;
      } else {
        prod.style.display = "none";
      }
    });

    // ❌ NO SCROLL si solo hay 1 dígito
    if (valor.length < 2) return;

    // ❌ NO SCROLL si no hay resultados
    if (!hayResultados) {
      if (mensajeError) {
        mensajeError.textContent = "❌ No hay resultados para esa talla";
      }
      return;
    }

    // ✅ SCROLL SOLO CUANDO TODO ES CORRECTO
    document
      .getElementById("catalogo-tenis")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
