import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión a MongoDB exitosa");
  } catch (err) {
    console.error("Error al conectar a MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
