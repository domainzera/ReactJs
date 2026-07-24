import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products?limit=&page=&sort=&query=
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
      baseUrl: `${req.baseUrl}`,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } =
      req.body;

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      status === undefined ||
      stock === undefined ||
      !category ||
      !thumbnails
    ) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    // Emitimos el evento de websocket para que la vista realTimeProducts
    // se actualice automáticamente también cuando el alta se hace por HTTP
    const io = req.app.get("io");
    if (io) {
      const updatedProducts = await productManager.getProducts({ limit: 100 });
      io.emit("products", updatedProducts.payload);
    }

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);

    if (!deleted) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    // Emitimos el evento de websocket para que la vista realTimeProducts
    // se actualice automáticamente también cuando la baja se hace por HTTP
    const io = req.app.get("io");
    if (io) {
      const updatedProducts = await productManager.getProducts({ limit: 100 });
      io.emit("products", updatedProducts.payload);
    }

    res.json({ status: "success", message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
