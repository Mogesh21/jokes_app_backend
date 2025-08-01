import { validationResult } from "express-validator";
import Subcategory from "../models/Subcategory.js";
import removeFile from "../utilities/removeFile.js";

export const getSubCategories = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  try {
    const result = await Subcategory.getSubCategories();
    const formattedResult = result.map((data) => ({
      ...data,
      cover_image: `${process.env.SERVER}/public/subcategories/${data.cover_image}`,
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

export const getSubcategoryById = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const [result] = await Subcategory.getSubCategoryById(id);
    result.cover_image = `${process.env.SERVER}/public/subcategories/${result.cover_image}`;
    res.status(200).json({
      data: result || {},
      message: "Data fetched succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSubcategoryByCatId = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      return res.status(400).json({
        message: "id is required",
      });
    }
    const result = await Subcategory.getSubCategoriesByCatId(id);
    const formattedResult = result.map((data) => ({
      ...data,
      cover_image: `${process.env.SERVER}/public/categories/${data.cover_image}`,
    }));
    res.status(200).json({
      data: formattedResult,
      message: "Data fetched succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addSubCategory = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['cat_id'] = { in: 'formData', type: 'number', required: true, description: 'Category id' }
  // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'Category name' }
  // #swagger.parameters['color'] = { in: 'formData', type: 'string', required: true, description: 'Category color' }
  // #swagger.parameters['border_color'] = { in: 'formData', type: 'string', required: true, description: 'Category border color' }
  // #swagger.parameters['image_file'] = { in: 'formData', type: 'file', required: true, description: 'Category image' }

  const filename = req.file?.filename;
  try {
    const errors = validationResult(req);
    if (!filename) {
      return res.status(400).json({
        message: "cover_image is required",
      });
    }
    if (!errors.isEmpty()) {
      removeFile(filename, "subcategories");
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;
    const insertId = await Subcategory.addSubCategory({ ...data, cover_image: filename });
    return res.status(201).json({
      data: {
        insertId,
      },
      message: "Subcategory added successfully",
    });
  } catch (err) {
    console.log(err);
    removeFile(filename, "subcategories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateSubCategory = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  // #swagger.consumes = ['multipart/form-data']
  // #swagger.parameters['cat_id'] = { in: 'formData', type: 'number', required: true, description: 'Category id' }
  // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'SubCategory name' }
  // #swagger.parameters['color'] = { in: 'formData', type: 'string', required: true, description: 'SubCategory color' }
  // #swagger.parameters['border_color'] = { in: 'formData', type: 'string', required: true, description: 'SubCategory border color' }
  // #swagger.parameters['cover_image'] = { in: 'formData', type: 'string', required: true, description: 'SubCategory image' }
  // #swagger.parameters['image_file'] = { in: 'formData', type: 'file', required: false, description: 'SubCategory image' }
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
      if (req.file) removeFile(filename, "subcategories");
      return res.status(400).json({
        message: "id is required",
      });
    } else if (!errors.isEmpty()) {
      if (req.file) removeFile(filename, "subcategories");
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }
    const data = req.body;
    const result = await Subcategory.updateSubCategory({
      ...data,
      cover_image: filename,
      id: id,
    });
    if (result === 0) {
      if (req.file) removeFile(filename, "subcategories");
      return res.status(404).json({
        message: "Subcategory not updated",
      });
    } else {
      if (req.file) removeFile(cover_image, "subcategories");
      return res.status(200).json({
        message: "Subcategory updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    if (req.file) removeFile(filename, "subcategories");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  // #swagger.tags = ["Sub Categories"]
  try {
    const id = req.params.id;
    if (!id || !parseInt(id)) {
      res.status(400).json({
        message: "id is required",
      });
    }
    const [result, data] = await Subcategory.deleteSubCategory(id);
    if (result === 0) {
      res.status(404).json({
        message: "Subcategory not found",
      });
    } else {
      if (data) removeFile(data.cover_image, "subcategories");
      res.status(200).json({
        message: "Subcategory deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
