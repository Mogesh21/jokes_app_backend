import express from "express";
import {
  addJoke,
  deleteJoke,
  getJokeById,
  getJokes,
  getJokesByCatId,
  getJokesBySubCatId,
  updateJoke,
} from "../controllers/jokeController.js";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { addJokeValidator, updateJokeValidator } from "../validator/validator.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/jokes";
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

const joke_storage = multer({
  storage: storage,
  limits: 10 * 1024 * 1024,
});

router.get("/", getJokes);
router.get("/:id", getJokeById);
router.get("/catid/:id", getJokesByCatId);
router.get("/subcatid/:id", getJokesBySubCatId);
router.post(
  "/",
  joke_storage.fields([
    { name: "joke_image" },
    { name: "speaker_image" },
    { name: "receiver_image" },
    { name: "image_answer" },
  ]),
  addJokeValidator,
  addJoke
);

router.put(
  "/:id",
  joke_storage.fields([
    { name: "joke_image" },
    { name: "speaker_image" },
    { name: "receiver_image" },
    { name: "image_answer" },
  ]),
  updateJokeValidator,
  updateJoke
);

router.delete("/:id", deleteJoke);

export default router;
