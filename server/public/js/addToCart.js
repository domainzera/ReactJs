document.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("add-to-cart-btn")) return;

  const { cart, product } = event.target.dataset;

  try {
    const response = await fetch(`/api/carts/${cart}/product/${product}`, {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "No se pudo agregar el producto");
    }

    event.target.textContent = "Agregado ✓";
    setTimeout(() => {
      event.target.textContent = "Agregar al carrito";
    }, 1500);
  } catch (error) {
    alert(error.message);
  }
});
