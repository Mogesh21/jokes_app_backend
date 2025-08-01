import { validationResult } from "express-validator";
import Type from "../models/Type.js";

export const getTypes = async (req, res) => {
  // #swagger.tags = ["Types"]
  try {
    const result = await Type.getTypes();
    res.status(200).json({
      data: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getTypeById = async (req, res) => {
  // #swagger.tags = ["Types"]
  try {
    const { id } = req.params;
    if (!id && !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const [result] = await Type.getTypeById(id);
    res.status(200).json({
      data: result || {},
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addType = async (req, res) => {
  // #swagger.tags = ["Types"]
  // #swagger.parameters["body"] = {in: "body", field: true, schema: { name: "sample", conversation: false, joke: false, joke_image: false, text_answer: false, image_answer: false }}

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const data = req.body;
    const insertId = await Type.addType(data);
    res.status(201).json({
      data: {
        insertId,
      },
      message: "Data created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateType = async (req, res) => {
  // #swagger.tags = ["Types"]
  // #swagger.parameters["body"] = {in: "body", field: true, schema: { name: "sample", conversation: false, joke: false, joke_image: false, text_answer: false, image_answer: false }}

  try {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const data = req.body;
    data.id = id;
    const result = await Type.updateType(data);
    if (result === 0) {
      res.status(404).json({
        message: "Data not updated",
      });
    } else {
      res.status(200).json({
        message: "Data updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteType = async (req, res) => {
  // #swagger.tags = ["Types"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await Type.deleteType(id);
    if (result === 0) {
      res.status(404).json({
        message: "Data not deleted",
      });
    } else {
      res.status(200).json({
        message: "Data deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
