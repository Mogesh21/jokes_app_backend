import express from "express";
import { getCategories, getJokes, getSubcategories } from "../controllers/apiController.js";

const router = express.Router();

router.post("/categories", getCategories);
router.post("/subcategories", getSubcategories);
router.post("/jokes", getJokes);

export default router;
