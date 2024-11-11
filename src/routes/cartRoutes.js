import express from "express";
import {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCarts);

router.get("/:cid", getCartById);

router.post("/", createCart);

router.post("/:cid/products", addProductToCart);

export default router;
