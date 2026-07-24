import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Trae el carrito con los productos completos (populate)
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid, { populate: true });

    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );

    if (!updatedCart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// DELETE api/carts/:cid/products/:pid -> elimina un producto puntual del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );

    if (!updatedCart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// PUT api/carts/:cid -> reemplaza todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        error: "Se espera un arreglo 'products' con { product, quantity }",
      });
    }

    const updatedCart = await cartManager.updateCart(req.params.cid, products);

    if (!updatedCart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// PUT api/carts/:cid/products/:pid -> actualiza SOLO la cantidad
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        status: "error",
        error: "Se espera un campo numérico 'quantity' mayor a 0",
      });
    }

    const updatedCart = await cartManager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", error: "Carrito o producto no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// DELETE api/carts/:cid -> vacía el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartManager.clearCart(req.params.cid);

    if (!updatedCart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
