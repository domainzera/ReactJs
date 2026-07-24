// Script opcional para cargar productos de prueba en Mongo.
// Uso: node server/scripts/seed.js
import "dotenv/config";
import { connectDB } from "../config/db.config.js";
import { ProductModel } from "../models/product.model.js";
import mongoose from "mongoose";

const sampleProducts = [
  {
    title: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido",
    code: "AUD001",
    price: 25000,
    status: true,
    stock: 15,
    category: "Electronica",
    thumbnails: [],
  },
  {
    title: "Teclado mecánico",
    description: "Teclado mecánico retroiluminado RGB",
    code: "TEC001",
    price: 45000,
    status: true,
    stock: 8,
    category: "Electronica",
    thumbnails: [],
  },
  {
    title: "Mouse ergonómico",
    description: "Mouse inalámbrico ergonómico",
    code: "MOU001",
    price: 12000,
    status: false,
    stock: 0,
    category: "Electronica",
    thumbnails: [],
  },
  {
    title: "Silla de oficina",
    description: "Silla ergonómica con soporte lumbar",
    code: "SIL001",
    price: 90000,
    status: true,
    stock: 5,
    category: "Muebles",
    thumbnails: [],
  },
  {
    title: "Escritorio de madera",
    description: "Escritorio de madera maciza 120x60",
    code: "ESC001",
    price: 130000,
    status: true,
    stock: 3,
    category: "Muebles",
    thumbnails: [],
  },
];

const run = async () => {
  await connectDB();
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(sampleProducts);
  console.log(`Se cargaron ${sampleProducts.length} productos de prueba.`);
  await mongoose.disconnect();
  process.exit(0);
};

run();
