import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

class CartManager {
  async getAllCarts() {
    try {
      return await Cart.find().populate("products.productId");
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate("products.productId");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const existingProductIndex = cart.products.findIndex(
        (p) => String(p.productId) === String(productId)
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  }
}

export default new CartManager();
