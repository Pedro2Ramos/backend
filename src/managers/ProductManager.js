import fs from "fs/promises";
import path from "path";

const productsFilePath = path.resolve("src/products.json");

class ProductManager {
  async getAllProducts() {
    try {
      const data = await fs.readFile(productsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los productos:", error);
      throw error;
    }
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find((p) => Number(p.id) === Number(id));
  }

  async addProduct(newProduct) {
    const products = await this.getAllProducts();
    newProduct.id =
      products.length > 0
        ? String(Number(products[products.length - 1].id) + 1)
        : "1";
    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getAllProducts();
    const index = products.findIndex((p) => Number(p.id) === Number(id));
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields };
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.getAllProducts();
    const product = products.find((p) => Number(p.id) === Number(id));
    if (!product) return null;

    products = products.filter((p) => Number(p.id) !== Number(id));
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return product;
  }
}

export default new ProductManager();
