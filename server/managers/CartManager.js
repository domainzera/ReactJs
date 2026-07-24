import { CartModel } from "../models/cart.model.js";

export class CartManager {
  async createCart() {
    return CartModel.create({ products: [] });
  }

  async getCartById(id, { populate = false } = {}) {
    const query = CartModel.findById(id);
    if (populate) {
      query.populate("products.product");
    }
    return query.lean();
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  // DELETE api/carts/:cid/products/:pid
  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return cart;
  }

  // PUT api/carts/:cid  (reemplaza todo el arreglo de productos)
  async updateCart(cartId, products) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = products.map((item) => ({
      product: item.product,
      quantity: item.quantity ?? 1,
    }));

    await cart.save();
    return cart;
  }

  // PUT api/carts/:cid/products/:pid  (actualiza sólo la cantidad)
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const product = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!product) return null;

    product.quantity = quantity;
    await cart.save();
    return cart;
  }

  // DELETE api/carts/:cid  (vacía el carrito)
  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
