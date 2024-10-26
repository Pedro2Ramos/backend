import fs from "fs/promises";
import { resolve } from "path";

const cartsFilePath = resolve("src", "data", "carts.json");

class CartManager {
  async readCartsFromFile() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      throw new Error("Error al leer el archivo de carritos");
    }
  }

  async writeCartsToFile(carts) {
    try {
      await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (err) {
      throw new Error("Error al guardar el archivo de carritos");
    }
  }

  async getAllCarts() {
    return await this.readCartsFromFile();
  }

  async getCartById(cartId) {
    const carts = await this.readCartsFromFile();
    return carts.find((cart) => cart.id === cartId);
  }

  async createCart() {
    const carts = await this.readCartsFromFile();
    const newCart = { id: String(Date.now()), products: [] };
    carts.push(newCart);
    await this.writeCartsToFile(carts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.readCartsFromFile();
    const cart = carts.find((c) => c.id === cartId);
    if (cart) {
      // Verificamos si el producto ya está en el carrito
      const existingProduct = cart.products.find((p) => p.id === productId);
      if (existingProduct) {
        existingProduct.quantity += 1; // Incrementamos la cantidad si ya existe
      } else {
        cart.products.push({ id: productId, quantity: 1 }); // Agregamos nuevo producto
      }
      await this.writeCartsToFile(carts);
      return cart;
    } else {
      throw new Error("Carrito no encontrado");
    }
  }
}

export default new CartManager();
