import CartManager from "../managers/CartManager.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await CartManager.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos" });
  }
};

export const getCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await CartManager.getCartById(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await CartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito" });
  }
};

export const addProductToCart = async (req, res) => {
  const cid = req.params.cid;
  const { productId } = req.body;

  try {
    const cart = await CartManager.addProductToCart(cid, productId);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
