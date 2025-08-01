import { validationResult } from "express-validator";
import CategoryModel from "../models/Category.js";
import removeFile from "../utilities/removeFile.js";

export const getCategories = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    const result = await CategoryModel.getAllCategories();
    const formattedResult = result.map((data) => ({
      ...data,
      cover_image: `${process.env.SERVER}/public/categories/${data.cover_image}`,
    }));
    res.status(200).json({
      data: formattedResult,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCategoryById = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [result] = await CategoryModel.getCategoryById(id);
    if (result) {
      result.cover_image = `${process.env.SERVER}/public/categories/${result.cover_image}`;
      res.status(200).json({
        data: result || {},
        message: "Data fetched successfully",
      });
    } else {
      res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addCategory = async (req, res) => { 
  // #swagger.tags = ['Categories']
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['type_id'] = { in: 'formData', type: 'number', required: true, description: 'Type id' }
  // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'Category name' }
  // #swagger.parameters['color'] = { in: 'formData', type: 'string', required: true, description: 'Category color' }
  // #swagger.parameters['border_color'] = { in: 'formData', type: 'string', required: true, description: 'Category border color' }
  // #swagger.parameters['image_file'] = { in: 'formData', type: 'file', required: true, description: 'Category image' }
  // #swagger.parameters['has_subcategory'] = { in: 'formData', type: 'boolean', required: true, description: '' }
  // #swagger.parameters['version'] = { in: 'formData', type: 'string', required: true, description: 'Category version' }

  const filename = req.file?.filename;
  try {
    const errors = validationResult(req);
    if (!filename) {
      return res.status(400).json({
        message: "cover_image is required",
      });
    } else if (!errors.isEmpty()) {
      removeFile(filename, "categories");
      return res.status(400).json({
        errors: errors.array()[0].msg,
      });
    }

    const data = req.body;
    const insertId = await CategoryModel.addCategory({ ...data, cover_image: filename });
    res.status(201).json({
      data: {
        insertId,
      },
      message: "Category added successfully",
    });
  } catch (err) {
    console.log(err);
    removeFile(filename, "categories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['type_id'] = { in: 'formData', type: 'number', required: true, description: 'Type id' }
  // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'Category name' }
  // #swagger.parameters['color'] = { in: 'formData', type: 'string', required: true, description: 'Category color' }
  // #swagger.parameters['border_color'] = { in: 'formData', type: 'string', required: true, description: 'Category border color' }
  // #swagger.parameters['image_file'] = { in: 'formData', type: 'file', required: false, description: 'Category image' }
  // #swagger.parameters['cover_image'] = { in: 'formData', type: 'string', required: true, description: 'Category image' }
  // #swagger.parameters['has_subcategory'] = { in: 'formData', type: 'boolean', required: true, description: '' }
  // #swagger.parameters['version'] = { in: 'formData', type: 'string', required: true, description: 'Category version' }
  const image = req.body.cover_image.split("/");
  const cover_image = image[image.length - 1];
  const filename = req.file ? req.file.filename : cover_image;

  try {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!filename) {
      return res.status(400).json({
        message: "cover_image is required",
      });
    } else if (!id || !parseInt(id)) {
      if (req.file) removeFile(filename, "categories");
      return res.status(400).json({
        message: "id is required",
      });
    } else if (!errors.isEmpty()) {
      if (req.file) removeFile(filename, "categories");
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const data = req.body;
    const result = await CategoryModel.updateCategory({ ...data, cover_image: filename, id: id });
    if (result === 0) {
      if (req.file) removeFile(filename, "categories");
      res.status(404).json({
        message: "Category not updated",
      });
    } else {
      if (req.file) removeFile(cover_image, "categories");
      res.status(200).json({
        message: "Category updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    if (req.file) removeFile(filename, "categories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  // #swagger.tags = ['Categories']
  try {
    const { id } = req.params;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [result, data] = await CategoryModel.deleteCategory(id);
    if (result === 0) {
      res.status(404).json({
        message: "Category not found",
      });
    } else {
      if (data) removeFile(data.cover_image, "categories");
      res.status(200).json({
        message: "Category deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
