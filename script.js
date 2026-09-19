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
   INTERSECTION OBSERVER (ANIMACIÓN DE PRODUCTOS)
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
   CARGA DEL CATÁLOGO DESDE FIREBASE (antes era productos.json)
   Se actualiza solo, en tiempo real, cuando editas algo
   desde admin.html — sin recargar la página y sin GitHub.
====================================================== */
function renderizarProducto(p) {
  const esGorra = p.categoria === "gorras";
  const tallas = p.tallas || [];

  const opciones = esGorra
    ? `<option value="">Verifica disponibilidad</option><option value="Unitalla">Unitalla</option>`
    : (tallas.length
        ? `<option value="">Verifica disponibilidad</option>` +
          tallas.map(t => `<option value="${t}">${t}</option>`).join("")
        : `<option value="Agotado">Agotado</option>`);

  return `
    <div class="producto"
         data-categoria="${p.categoria}"
         ${esGorra ? "" : `data-tallas="${tallas.join(",")}"`}>

      <img src="${p.imagen}" alt="${p.nombre}">

      <div class="info">
        <h2>${p.nombre}</h2>
        <p>Q${p.precio}</p>

        <select onchange="cambiarTalla(this, 'talla-${p.id}')">
          ${opciones}
        </select>

        <div class="talla-seleccionada" id="talla-${p.id}">Talla: --</div>
      </div>
    </div>
  `;
}

function cargarCatalogoDesdeFirebase() {
  const contTenis = document.getElementById("catalogo-tenis");
  const contGorras = document.getElementById("catalogo-gorras");
  if (!contTenis && !contGorras) return;

  db.collection("productos").onSnapshot(snapshot => {
    const productos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // El orden lo controlas tú desde el panel de administración (botones ▲▼ y "Al inicio").
    productos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    const gorras = productos.filter(p => p.categoria === "gorras");
    const tenis = productos.filter(p => p.categoria !== "gorras");

    if (contGorras) contGorras.innerHTML = gorras.map(renderizarProducto).join("");
    if (contTenis) contTenis.innerHTML = tenis.map(renderizarProducto).join("");

    document.querySelectorAll(".producto").forEach(p => observer.observe(p));
  }, err => {
    console.error("No se pudo cargar el catálogo:", err);
  });
}

cargarCatalogoDesdeFirebase();

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

    // (antes decía "btn.dataset.filter" y por eso los filtros no funcionaban)
    const filtro = btn.dataset.filtro;
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
   BUSCADOR POR TALLA (FIX COMPLETO)
====================================================== */
const inputBuscador = document.getElementById("buscador");
const mensajeError = document.getElementById("errorTalla");

if (inputBuscador) {
  inputBuscador.addEventListener("input", () => {
    let valor = inputBuscador.value.trim();
    const productos = document.querySelectorAll(".producto");
    let hayResultados = false;

    // ❌ No permitir letras
    if (!/^\d*$/.test(valor)) {
      inputBuscador.value = valor.replace(/\D/g, "");
      return;
    }

    // Limpiar mensaje
    if (mensajeError) mensajeError.textContent = "";

    // 🔁 INPUT VACÍO → MOSTRAR TODO (TENIS + GORRAS)
    if (valor === "") {
      productos.forEach(prod => {
        prod.style.display = "block";
      });
      return; // ⛔ sin scroll
    }

    // 🔍 BUSCAR SOLO TENIS
    productos.forEach(prod => {
      const tallas = prod.dataset.tallas;

      // Gorras fuera cuando se busca talla
      if (!tallas) {
        prod.style.display = "none";
        return;
      }

      if (tallas.split(",").includes(valor)) {
        prod.style.display = "block";
        hayResultados = true;
      } else {
        prod.style.display = "none";
      }
    });

    // ❌ No scroll si solo 1 dígito
    if (valor.length < 2) return;

    // ❌ No hay resultados
    if (!hayResultados) {
      if (mensajeError) {
        mensajeError.textContent = "❌ No hay resultados para esa talla";
      }
      return;
    }

    // ✅ Scroll correcto
    document
      .getElementById("catalogo-tenis")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
