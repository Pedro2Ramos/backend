import fs from "fs/promises";
import path from "path";

const cartsFilePath = path.resolve("src", "data", "carts.json");

class CartManager {
  async getAllCarts() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      throw error;
    }
  }

  async getCartById(id) {
    const carts = await this.getAllCarts();
    return carts.find((c) => Number(c.id) === Number(id));
  }

  async createCart() {
    const carts = await this.getAllCarts();
    const newCart = {
      id: String(Date.now()),
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAllCarts();
    const cart = carts.find((c) => Number(c.id) === Number(cartId));
    if (!cart) return null;

    const existingProduct = cart.products.find(
      (p) => Number(p.id) === Number(productId)
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default new CartManager();
