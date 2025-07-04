const URL = "http://localhost:3000/productos"; // URL del servidor API
const productosContenedor = document.getElementById("productos");
const formulario = document.getElementById("formulario");

// Escucha el evento submit del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Recoge los valores del formulario
  const nuevoProducto = {
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    precio: parseFloat(document.getElementById("precio").value),
    descripcion: document.getElementById("descripcion").value.trim()
  };

  // Validaciones
  if (!nuevoProducto.nombre || !nuevoProducto.categoria || isNaN(nuevoProducto.precio) || !nuevoProducto.descripcion) {
    alert("Todos los campos son obligatorios y el precio debe ser numérico.");
    return;
  }

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto)
    });

    if (!res.ok) throw new Error("Error al agregar el producto");

    formulario.reset();
    obtenerProductos();
  } catch (error) {
    console.error("Error al enviar producto:", error);
  }
});

// Obtener productos desde el servidor (GET)
async function obtenerProductos() {
  try {
    const res = await fetch(URL);
    const productos = await res.json();

    productosContenedor.innerHTML = "";
    productos.forEach(producto => crearTarjeta(producto));
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

// Crear una tarjeta visual del producto
function crearTarjeta({ id, nombre, categoria, precio, descripcion }) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card";

  tarjeta.innerHTML = `
    <h3>${nombre}</h3>
    <p><strong>Categoría:</strong> ${categoria}</p>
    <p><strong>Precio:</strong> $${precio}</p>
    <p>${descripcion}</p>
    <div class="acciones">
      <button class="editar">Editar</button>
      <button class="eliminar">Eliminar</button>
    </div>
  `;

  // Botón editar
  tarjeta.querySelector(".editar").addEventListener("click", () => editarProducto(id));
  // Botón eliminar
  tarjeta.querySelector(".eliminar").addEventListener("click", () => eliminarProducto(id));

  productosContenedor.appendChild(tarjeta);
}

// Eliminar producto por ID (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");

    obtenerProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// Editar producto (PUT)
async function editarProducto(id) {
  const nombre = prompt("Nuevo nombre:");
  const categoria = prompt("Nueva categoría:");
  const precio = parseFloat(prompt("Nuevo precio:"));
  const descripcion = prompt("Nueva descripción:");

  if (!nombre || !categoria || isNaN(precio) || !descripcion) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, categoria, precio, descripcion })
    });

    if (!res.ok) throw new Error("Error al actualizar producto");

    obtenerProductos();
  } catch (error) {
    console.error("Error al editar producto:", error);
  }
}

// Cargar productos al inicio
obtenerProductos();
