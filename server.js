import express from "express";
import { Server } from "socket.io";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import http from "http";
import { resolve } from "path";
import { engine } from "express-handlebars";
import connectDB from "./src/configuracion/db.js";
import Product from "./src/models/Product.js";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.engine(
  "handlebars",
  engine({
    defaultLayout: false,
  })
);
app.set("view engine", "handlebars");
app.set("views", resolve("src", "views"));

connectDB();

io.on("connection", (socket) => {
  console.log("Un cliente se conectó");

  socket.on("getProducts", async () => {
    try {
      const products = await Product.find();
      socket.emit("products", products);
    } catch (err) {
      console.error("Error al obtener productos:", err.message);
    }
  });

  socket.on("addProduct", async (newProduct) => {
    try {
      const product = new Product({
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        thumbnail: newProduct.thumbnail,
      });

      await product.save();

      const allProducts = await Product.find();
      io.emit("products", allProducts);
    } catch (err) {
      console.error("Error al agregar el producto:", err.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      const allProducts = await Product.find();
      io.emit("products", allProducts);
    } catch (err) {
      console.error("Error al eliminar el producto:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Lista de productos" });
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).json({ message: "Error al leer los productos" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error al leer los productos" });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await Product.findById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al leer el producto" });
  }
});

app.post("/api/products", async (req, res) => {
  const newProduct = req.body;
  try {
    const product = new Product({
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      stock: newProduct.stock,
      thumbnail: newProduct.thumbnail,
    });
    await product.save();

    const allProducts = await Product.find();
    io.emit("products", allProducts);

    res.status(201).json(product);
  } catch (err) {
    console.error("Error al guardar el producto:", err);
    res.status(500).json({ message: "Error al guardar el producto", error: err.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  try {
    const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });
    if (product) {
      const allProducts = await Product.find();
      io.emit("products", allProducts);
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await Product.findByIdAndDelete(pid);
    if (product) {
      const allProducts = await Product.find();
      io.emit("products", allProducts);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

app.use("/api/carts", cartRoutes);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
