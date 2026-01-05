// ===============================
// TEXTO ROTATIVO DEL BANNER
// ===============================
const frases = ["🔥 Nuevos modelos", "🔥 Edición limitada", "🔥 Estilo urbano", "🔥 Solo aquí"];
let indice = 0;

function cambiarTexto() {
  const texto = document.getElementById("texto-rotativo");
  if (!texto) return;
  texto.textContent = frases[indice];
  indice = (indice + 1) % frases.length;
}

cambiarTexto();
setInterval(cambiarTexto, 2000);

// ===============================
// FILTROS POR CATEGORÍA + SCROLL
// ===============================
const botonesFiltro = document.querySelectorAll(".filtro-btn");

function filtrarProductos(categoria) {
  const productos = document.querySelectorAll(".producto");

  productos.forEach(prod => {
    const cat = prod.dataset.categoria;

    if (categoria === "todos" || cat === categoria) {
      prod.style.display = "block";
      prod.classList.remove("visible");
      setTimeout(() => prod.classList.add("visible"), 50);
    } else {
      prod.style.display = "none";
    }
  });
}

botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const categoria = btn.dataset.filter;
    filtrarProductos(categoria);

    // Scroll automático
    const destino =
      categoria === "gorras"
        ? document.querySelector(".catalogo-gorras")
        : document.getElementById("catalogo-tenis");

    destino?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===============================
// BUSCADOR POR TALLA
// ===============================
const buscador = document.getElementById("buscador");
const errorTalla = document.getElementById("errorTalla");

if (buscador) {
  buscador.addEventListener("input", function () {
    const valor = this.value.trim();

    if (!/^\d*$/.test(valor)) {
      errorTalla.textContent = "Solo se permiten números";
      return;
    }

    errorTalla.textContent = "";

    document.querySelectorAll(".producto").forEach(p => {
      const tallas = p.dataset.tallas || "";
      p.style.display =
        valor === "" || tallas.includes(valor)
          ? "block"
          : "none";
    });
  });
}

// ===============================
// MOSTRAR TALLA SELECCIONADA
// ===============================
function cambiarTalla(select, id) {
  const div = document.getElementById(id);
  if (div) {
    div.textContent = select.value
      ? "Talla: " + select.value
      : "Talla: --";
  }
}
window.cambiarTalla = cambiarTalla;

// ===============================
// ANIMACIÓN AL APARECER
// ===============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".producto").forEach(card => observer.observe(card));

