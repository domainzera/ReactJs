import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { ProductManager } from "./managers/ProductManager.js";
import { connectDB } from "./config/db.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const productManager = new ProductManager();

// Handlebars
app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
      multiply: (a, b) => a * b,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = createServer(app);
const io = new Server(httpServer);

// Hacemos disponible io en las rutas HTTP (req.app.get("io")) para poder
// emitir eventos de websocket desde dentro de un endpoint POST/DELETE
app.set("io", io);

io.on("connection", async (socket) => {
  console.log("Cliente conectado:", socket.id);

  const initialProducts = await productManager.getProducts({ limit: 100 });
  socket.emit("products", initialProducts.payload);

  socket.on("newProduct", async (productData) => {
    try {
      await productManager.addProduct(productData);
      const updatedProducts = await productManager.getProducts({ limit: 100 });
      io.emit("products", updatedProducts.payload);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(id);
      const updatedProducts = await productManager.getProducts({ limit: 100 });
      io.emit("products", updatedProducts.payload);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
};

start();
