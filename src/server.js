import express from "express";
import { Server } from "socket.io";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import http from "http";
import fs from "fs";
import { resolve } from "path";
import { engine } from "express-handlebars";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productsFilePath = resolve("src", "data", "products.json");

app.use(express.json());

app.engine(
  "handlebars",
  engine({
    defaultLayout: false,
  })
);
app.set("view engine", "handlebars");
app.set("views", resolve("src", "views"));

io.on("connection", (socket) => {
  console.log("Un cliente se conectó");

  readProductsFromFile((err, products) => {
    if (err) {
      console.error("Error al leer productos:", err.message);
      return;
    }
    socket.emit("products", products);
  });

  socket.on("addProduct", (newProduct) => {
    console.log("Nuevo producto recibido:", newProduct);

    readProductsFromFile((err, products) => {
      if (err) {
        return console.error("Error al leer productos:", err.message);
      }

      newProduct.id = String(products.length + 1);
      products.push(newProduct);

      writeProductsToFile(products, (writeErr) => {
        if (writeErr) {
          return console.error(
            "Error al guardar el producto:",
            writeErr.message
          );
        }

        io.emit("newProduct", newProduct);
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Lista de productos" });
});

app.get("/realtimeproducts", (req, res) => {
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    res.render("realTimeProducts", { products });
  });
});

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

app.get("/api/products", (req, res) => {
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    res.json(products);
  });
});

app.get("/api/products/:pid", (req, res) => {
  const pid = req.params.pid;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    const product = products.find((p) => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  });
});

app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  readProductsFromFile((err, products) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los productos" });
    }
    newProduct.id = String(products.length + 1);
    products.push(newProduct);
    writeProductsToFile(products, (writeErr) => {
      if (writeErr) {
        return res
          .status(500)
          .json({ message: "Error al guardar el producto" });
      }

      io.emit("newProduct", newProduct);
      res.status(201).json(newProduct);
    });
  });
});

app.put("/api/products/:pid", (req, res) => {
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

        io.emit("updateProduct", products[index]);
        res.json(products[index]);
      });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  });
});

app.delete("/api/products/:pid", (req, res) => {
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

      io.emit("deleteProduct", pid);
      res.status(204).end();
    });
  });
});

app.use("/api/carts", cartRoutes);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
