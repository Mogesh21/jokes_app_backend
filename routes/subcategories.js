import express from "express";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubcategoryByCatId,
  getSubcategoryById,
  updateSubCategory,
} from "../controllers/subcategoryController.js";
import { addSubCategoryValidator, updateSubCategoryValidator } from "../validator/validator.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/subcategories";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "" + Math.floor(100 + Math.random() * 900) + path.extname(file.originalname)
    );
  },
});

const subcategory = multer({
  storage: storage,
  limits: 5 * 1024 * 1024,
});

router.get("/", getSubCategories);
router.get("/:id", getSubcategoryById);
router.get("/catid/:id", getSubcategoryByCatId);
router.post("/", subcategory.single("image_file"), addSubCategoryValidator, addSubCategory);
router.put("/:id", subcategory.single("image_file"), updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
