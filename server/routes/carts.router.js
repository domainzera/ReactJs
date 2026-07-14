import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
