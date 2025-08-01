import express from "express";
import {
  addApp,
  deleteApp,
  getAppById,
  getApps,
  updateApp,
} from "../controllers/appsController.js";
import { addAppValidator, updateAppValidator } from "../validator/validator.js";

const router = express.Router();

router.get("/", getApps);
router.get("/:id", getAppById);
router.post("/", addAppValidator, addApp);
router.put("/:id", updateAppValidator, updateApp);
router.delete("/:id", deleteApp);

export default router;
