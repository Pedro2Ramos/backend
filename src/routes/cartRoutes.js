import express from "express";
import { createCart, getCartById, addProductToCart, getAllCarts } from "../controllers/cartController.js";

const router = express.Router();


router.post("/", createCart);


router.get("/", getAllCarts);


router.get("/:cartId", getCartById);


router.post("/:cartId/products", addProductToCart);

export default router;
