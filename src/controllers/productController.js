import ProductManager from "../managers/ProductManager";

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductManager.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await ProductManager.getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = await ProductManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al añadir el producto" });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.pid;
  try {
    const updatedProduct = await ProductManager.updateProduct(id, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.pid;
  try {
    const deletedProduct = await ProductManager.deleteProduct(id);
    if (deletedProduct) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
