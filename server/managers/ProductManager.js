import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, "../data/products.json");

export class ProductManager {
  async #readProducts() {
    try {
      const data = await fs.readFile(productsPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(productsPath, "[]", "utf-8");
        return [];
      }
      throw error;
    }
  }

  async #writeProducts(products) {
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2), "utf-8");
  }

  async getProducts() {
    return this.#readProducts();
  }

  async getProductById(id) {
    const products = await this.#readProducts();
    return products.find((product) => product.id === id) ?? null;
  }

  async addProduct(product) {
    const products = await this.#readProducts();
    const newProduct = {
      id: randomUUID(),
      ...product,
    };
    products.push(newProduct);
    await this.#writeProducts(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.#readProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      return null;
    }

    const { id: _id, ...fieldsToUpdate } = updates;
    products[index] = { ...products[index], ...fieldsToUpdate };
    await this.#writeProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    await this.#writeProducts(products);
    return true;
  }
}
