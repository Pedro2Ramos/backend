import Product from '../models/Product'; 

class ProductManager {
 
  async getAllProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error;
    }
  }

  async addProduct(newProduct) {
    try {
      const product = new Product(newProduct);
      await product.save();
      return product;
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
      return product;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      return product;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

export default new ProductManager();
