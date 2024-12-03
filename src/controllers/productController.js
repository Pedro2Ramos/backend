import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "asc", query } = req.query;
    const queryFilter = query ? { name: new RegExp(query, "i") } : {};
    const sortOrder = sort === "desc" ? -1 : 1;

    const products = await Product.find(queryFilter)
      .sort({ price: sortOrder })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(queryFilter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      total,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error.message);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al añadir el producto:", error.message);
    res.status(500).json({ message: "Error al añadir el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.pid;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.pid;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
