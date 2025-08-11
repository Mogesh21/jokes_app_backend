import express from "express";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoriesController.js";
import { addCategoryValidator, updateCategoryValidator } from "../validator/validator.js";
import Category from "../models/Category.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/categories";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: async function (req, file, cb) {
    const id = req.params.id;
    const [data] = await Category.getCategoryById(id);
    let image_name =
      Date.now() + "" + Math.floor(100 + Math.random() * 900) + path.extname(file.originalname);
    if (data) image_name = data.cover_image;
    cb(null, image_name);
  },
});

const category = multer({
  storage: storage,
  limits: 5 * 1024 * 1024,
});

router.get("/", getCategories);
router.post("/", category.single("image_file"), addCategoryValidator, addCategory);
router.put("/:id", category.single("image_file"), updateCategoryValidator, updateCategory);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

export default router;
