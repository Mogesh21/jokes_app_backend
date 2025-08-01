import express from "express";
import {
  addType,
  deleteType,
  getTypeById,
  getTypes,
  updateType,
} from "../controllers/typesController.js";
import { addTypeValidator, updateTypeValidator } from "../validator/validator.js";

const router = express.Router();

router.get("/", getTypes);
router.post("/", addTypeValidator, addType);
router.get("/:id", getTypeById);
router.put("/:id", updateTypeValidator, updateType);
router.delete("/:id", deleteType);

export default router;
