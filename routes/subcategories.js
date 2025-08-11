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
import Subcategory from "../models/Subcategory.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/subcategories";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: async function (req, file, cb) {
    const id = req.params.id;
    const [data] = await Subcategory.getSubCategoryById(id);
    let image_name =
      Date.now() + "" + Math.floor(100 + Math.random() * 900) + path.extname(file.originalname);
    if (data) image_name = data.cover_image;
    cb(null, image_name);
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
router.put(
  "/:id",
  subcategory.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "image_file", maxCount: 1 },
  ]),
  updateSubCategoryValidator,
  updateSubCategory
);
router.delete("/:id", deleteSubCategory);

export default router;
