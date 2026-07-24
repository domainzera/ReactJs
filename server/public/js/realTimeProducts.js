const socket = io();

const list = document.getElementById("products-list");
const form = document.getElementById("product-form");

function renderProducts(products) {
  list.innerHTML = "";

  if (!products.length) {
    const empty = document.createElement("li");
    empty.textContent = "No hay productos cargados todavía.";
    list.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    const li = document.createElement("li");
    li.dataset.id = product._id;
    li.innerHTML = `
      <strong>${product.title}</strong> - ${product.description} - $${product.price} - Stock: ${product.stock}
      <button class="delete-btn" data-id="${product._id}">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

// El servidor emite la lista actualizada cada vez que se crea o elimina un producto
socket.on("products", (products) => {
  renderProducts(products);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newProduct = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    status: formData.get("status") === "on",
    thumbnails: [],
  };

  socket.emit("newProduct", newProduct);
  form.reset();
});

list.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-btn")) return;
  const id = event.target.dataset.id;
  socket.emit("deleteProduct", id);
});
