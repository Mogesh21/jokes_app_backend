import { validationResult } from "express-validator";
import App from "../models/App.js";

export const getApps = async (req, res) => {
  // #swagger.tags = ["Apps"]
  try {
    const result = await App.getApps();
    res.status(200).json({
      data: result,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: [],
      message: "Internal Server Error",
    });
  }
};

export const getAppById = async (req, res) => {
  // #swagger.tags = ["Apps"]
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const [result] = await App.getAppById(id);
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

export const addApp = async (req, res) => {
  // #swagger.tags = ["Apps"]
  // #swagger.parameters['body'] = {in: "body",required: true,schema: {name: "", categories: []}};
  try {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const id = await App.addApp(data);
    res.status(201).json({
      id: id,
      message: "App created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateApp = async (req, res) => {
  // #swagger.tags = ["Apps"]
  // #swagger.parameters['body'] = {in: "body",required: true,schema: {name: "", categories: []}};
  try {
    const data = req.body;
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array().map((err) => err.msg)[0],
      });
    }

    data.id = id;
    const result = await App.updateApp(data);
    if (result === 0) {
      res.status(404).json({
        message: "App not updated",
      });
    } else {
      res.status(200).json({
        message: "App updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteApp = async (req, res) => {
  // #swagger.tags = ['Apps']
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const result = await App.deleteApp(id);
    if (result === 0) {
      res.status(404).json({
        message: "App not deleted",
      });
    } else {
      res.status(200).json({
        message: "App deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
