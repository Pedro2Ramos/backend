import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos:", err.message);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await Product.findById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error("Error al obtener el producto:", err.message);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  const { name, description, price, category } = req.body;
  
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });

    await newProduct.save();

    req.app.get("io").emit("new-product", newProduct);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error al guardar el producto:", err.message);
    res.status(500).json({ message: "Error al guardar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      { name, description, price, category },
      { new: true }
    );

    if (updatedProduct) {
      req.app.get("io").emit("update-product", updatedProduct);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el producto:", err.message);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (deletedProduct) {
      req.app.get("io").emit("delete-product", pid);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar el producto:", err.message);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

export default router;
