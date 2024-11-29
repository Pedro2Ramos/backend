import mongoose from "mongoose";
import Product from "./src/models/Product.js";

const MONGO_URI = "mongodb+srv://pdr2024:pedromiguel0610@cluster0.p5h5y.mongodb.net/"; 

const testProduct = async () => {
  try {
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a MongoDB");

    
    const newProduct = new Product({
      title: "Producto de Prueba",
      description: "Este es un producto de prueba",
      price: 100,
      category: "Test",
      stock: 10,
      thumbnail: "https://via.placeholder.com/150",
    });

    
    const savedProduct = await newProduct.save();
    console.log("Producto guardado:", savedProduct);

    
    mongoose.disconnect();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error probando el modelo Product:", error);
  }
};

testProduct();
