import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";
import { CartManager } from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

const CART_COOKIE = "cartId";

// Middleware que garantiza que siempre haya un carrito "activo" asociado
// al navegador (vía cookie), para poder usar el botón "Agregar al carrito"
// sin tener que implementar login/sesiones de usuario.
async function ensureCart(req, res, next) {
  try {
    let cartId = req.cookies?.[CART_COOKIE];
    let cart = cartId ? await cartManager.getCartById(cartId) : null;

    if (!cart) {
      cart = await cartManager.createCart();
      res.cookie(CART_COOKIE, cart._id.toString(), { httpOnly: true });
    }

    req.cartId = cart._id.toString();
    next();
  } catch (error) {
    next(error);
  }
}

async function renderProductList(req, res) {
  try {
    const { limit, page, sort, query } = req.query;

    // baseUrl refleja la ruta real desde la que se pidió el listado, para que
    // prevLink/nextLink apunten a /products o a / según corresponda
    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
      baseUrl: req.baseUrl + req.path,
    });

    res.render("home", {
      ...result,
      cartId: req.cartId,
      limit: limit || 10,
      sort: sort || "",
      query: query || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// El listado de productos con paginación queda disponible tanto en "/"
// como en "/products", ambas rutas renderizan la misma vista.
router.get("/", ensureCart, renderProductList);
router.get("/products", ensureCart, renderProductList);

router.get("/products/:pid", ensureCart, async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).render("home", {
        payload: [],
        error: "Producto no encontrado",
      });
    }

    res.render("productDetail", { product, cartId: req.cartId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid, { populate: true });

    if (!cart) {
      return res.status(404).render("cartDetail", {
        notFound: true,
        cid: req.params.cid,
      });
    }

    res.render("cartDetail", { cid: req.params.cid, products: cart.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100 });
    res.render("realTimeProducts", { products: result.payload });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
