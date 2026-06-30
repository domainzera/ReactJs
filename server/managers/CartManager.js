import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, "../data/carts.json");

export class CartManager {
  async #readCarts() {
    try {
      const data = await fs.readFile(cartsPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(cartsPath, "[]", "utf-8");
        return [];
      }
      throw error;
    }
  }

  async #writeCarts(carts) {
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), "utf-8");
  }

  async createCart() {
    const carts = await this.#readCarts();
    const newCart = {
      id: randomUUID(),
      products: [],
    };
    carts.push(newCart);
    await this.#writeCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readCarts();
    return carts.find((cart) => cart.id === id) ?? null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readCarts();
    const cart = carts.find((item) => item.id === cartId);

    if (!cart) {
      return null;
    }

    const existingProduct = cart.products.find((item) => item.product === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await this.#writeCarts(carts);
    return cart;
  }
}
