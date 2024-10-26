import express from "express";
import fs from "fs";
import { resolve } from "path";

const productsFilePath = resolve("src", "data", "products.json");

const router = express.Router();

const readProductsFromFile = (callback) => {
  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err.message);
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};

const writeProductsToFile = (products, callback) => {
  fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
    callback(err);
  });
};

router.get("/", (req, res) => {
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos 1" });
    }
    res.json(products);
  });
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos 2" });
    }
    const product = products.find((p) => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  });
});

router.post("/", (req, res) => {
  const newProduct = req.body;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos 3" });
    }
    newProduct.id = String(products.length + 1);
    products.push(newProduct);
    writeProductsToFile(products, (writeErr) => {
      if (writeErr) {
        return res
          .status(500)
          .json({ message: "Error al guardar el producto 4" });
      }
      res.status(201).json(newProduct);
    });
  });
});

router.put("/:pid", (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    const index = products.findIndex((p) => p.id === pid);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      writeProductsToFile(products, (writeErr) => {
        if (writeErr) {
          return res
            .status(500)
            .json({ message: "Error al actualizar el producto" });
        }
        res.json(products[index]);
      });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  });
});

router.delete("/:pid", (req, res) => {
  const pid = req.params.pid;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    const newProducts = products.filter((p) => p.id !== pid);
    writeProductsToFile(newProducts, (writeErr) => {
      if (writeErr) {
        return res
          .status(500)
          .json({ message: "Error al eliminar el producto" });
      }
      res.status(204).end();
    });
  });
});

export default router;
