import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createCart = async (req, res) => {
  try {
    const newCart = new Cart({
      products: [],
    });

    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error: error.message });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product");

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos", error: error.message });
  }
};

export const getCartById = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await Cart.findById(cartId).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  const { cartId } = req.params;
  const { productId } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
  }
};
