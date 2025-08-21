import express from "express";
import multer from "multer";
import path from "path";
import { copyFileSync, existsSync, mkdirSync, rmdirSync, rmSync } from "fs";
import db from "../config/db.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/temp";
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: async function (req, file, cb) {
    let image_name =
      Date.now() + "" + Math.floor(100 + Math.random() * 900) + path.extname(file.originalname);
    cb(null, image_name);
  },
});

const joke_storage = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

router.post(
  "/update-images",
  joke_storage.fields([{ name: "speaker_image" }, { name: "receiver_image" }]),
  async (req, res) => {
    // #swagger.tags = ['Development']
    // #swagger.requestBody = {}
    // #swagger.parameters['speaker_image'] = { in: 'formData', type: 'file', required: true }
    // #swagger.parameters['receiver_image'] = { in: 'formData', type: 'file', required: true }
    // #swagger.parameters['subcat_id'] = { in: 'formData', type: 'number', required: true }
    // #swagger.parameters['speaker'] = { in: 'formData', type: 'string', required: true }

    try {
      console.log(req.files);
      const speaker_image = req.files.speaker_image;
      const receiver_image = req.files.receiver_image;
      const subcat_id = req.body.subcat_id;
      const speaker = req.body.speaker;
      if (!speaker_image || !receiver_image) {
        return res.status(400).json({
          result: 0,
          resultData: null,
          message: "Both speaker_image and receiver_image are required",
        });
      }

      const speakerImagePath = path.join(
        process.cwd(),
        "public",
        "temp",
        speaker_image[0].filename
      );
      const receiverImagePath = path.join(
        process.cwd(),
        "public",
        "temp",
        receiver_image[0].filename
      );

      const [data] = await db.query("SELECT * FROM jokes WHERE subcat_id = ?", [subcat_id]);
      if (data.length === 0) {
        return res.status(404).json({
          result: 0,
          resultData: null,
          message: "No jokes found with the provided IDs",
        });
      }

      data.forEach(async (joke) => {
        console.log(joke.content, typeof joke.content);
        if (typeof joke.content === "string") {
          joke.content = JSON.parse(joke.content);
        }
        const speakerImage = path.basename(joke.content.speaker_image);
        const receiverImage = path.basename(joke.content.receiver_image);

        const originalSpeakerImage = path.join(process.cwd(), "public", "jokes", speakerImage);
        const originalReceiverImage = path.join(process.cwd(), "public", "jokes", receiverImage);
        if (speaker.toLowerCase() === joke.content.speaker) {
          copyFileSync(speakerImagePath, originalSpeakerImage);
          copyFileSync(receiverImagePath, originalReceiverImage);
        } else {
          copyFileSync(speakerImagePath, originalReceiverImage);
          copyFileSync(receiverImagePath, originalSpeakerImage);
        }
      });

      rmdirSync(path.join(process.cwd(), "public", "temp"), { recursive: true, force: true });

      res.status(200).json({
        result: 1,
        resultData: {
          speaker_image: speakerImagePath,
          receiver_image: receiverImagePath,
        },
        message: "Images updated successfully",
      });
    } catch (err) {
      console.error(err);
      rmSync(path.join(process.cwd(), "public", "temp"), { recursive: true, force: true });
      res.status(500).json({
        result: 0,
        resultData: null,
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
