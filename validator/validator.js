import { body, param } from "express-validator";

export const addAppValidator = [
  body("name").trim().notEmpty().isString().withMessage("name is required"),
  body("categories").custom((val, { req }) => {
    const categories = req.body.categories;
    if (!categories) throw new Error("categories is required");
    if (!Array.isArray(categories) && typeof categories !== "string") {
      throw new Error("categories must be an array or a string");
    }
    return true;
  }),
];

export const updateAppValidator = [
  param("id").trim().notEmpty().isInt().withMessage("id is required").toInt(),
  body("name").trim().notEmpty().isString().withMessage("name is required"),
  body("categories").custom((val, { req }) => {
    const categories = req.body.categories;
    if (!categories) throw new Error("categories is required");
    if (!Array.isArray(categories) && typeof categories !== "string") {
      throw new Error("categories must be an array or a string");
    }
    return true;
  }),
];

export const addTypeValidator = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("conversation").isBoolean().withMessage("conversation is required"),
  body("joke").isBoolean().withMessage("joke is required"),
  body("text_answer").isBoolean().withMessage("text_answer is required"),
  body("image_answer").isBoolean().withMessage("image_answer is required"),
];

export const updateTypeValidator = [
  param("id").trim().isInt().withMessage("id is required").toInt(),
  body("name").trim().notEmpty().withMessage("name is required"),
  body("conversation").isBoolean().withMessage("conversation is required"),
  body("joke").isBoolean().withMessage("joke is required"),
  body("text_answer").isBoolean().withMessage("text_answer is required"),
  body("image_answer").isBoolean().withMessage("image_answer is required"),
];

export const addCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 20 })
    .withMessage("name must be at most 20 characters"),

  body("type_id").trim().toInt().notEmpty().withMessage("type_id is requied"),
  body("color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("color must be color code #ffffff");
  }),
  body("border_color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("border_color must be color code #ffffff");
  }),
  body("has_subcategory").custom((value) => {
    if (value === "true" || value === "false") return true;
    throw new Error("has_subcategory must be a boolean (true/false)");
  }),
  body("version").custom((value) => {
    if (!value) throw new Error("version is required");
    const version = value.split(".");
    if (version.length === 3) return true;
    throw new Error("version must be in format x.y.z");
  }),
];

export const updateCategoryValidator = [
  param("id").trim().toInt().notEmpty().withMessage("Id is required"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 20 })
    .withMessage("name must be at most 20 characters"),

  body("type_id").trim().toInt().notEmpty().withMessage("type_id is requied"),
  body("cover_image").trim().notEmpty().withMessage("cover_image is requied"),
  body("color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("color must be color code #ffffff");
  }),
  body("border_color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("border_color must be color code #ffffff");
  }),
  body("has_subcategory").custom((value) => {
    if (value === "true" || value === "false" || parseInt(value) === 1 || parseInt(value) === 0)
      return true;
    throw new Error("has_subcategory must be a boolean (true/false)");
  }),
  body("version").custom((value) => {
    if (!value) throw new Error("version is required");
    const version = value.split(".");
    if (version.length === 3) return true;
    throw new Error("version must be in format x.y.z");
  }),
];

export const addSubCategoryValidator = [
  body("cat_id").trim().notEmpty().withMessage("cat_id is required").toInt(),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 20 })
    .withMessage("name must be at most 20 characters"),
  body("color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("color must be color code #ffffff");
  }),
  body("border_color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("border_color must be color code #ffffff");
  }),
];

export const updateSubCategoryValidator = [
  param("id").trim().isInt().withMessage("id is required").toInt(),
  body("cat_id").trim().notEmpty().isInt().withMessage("cat_id is required").toInt(),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 20 })
    .withMessage("name must be at most 20 characters"),
  body("color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("color must be color code #ffffff");
  }),
  body("border_color").custom((value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    if (regex.test(value)) return true;
    throw new Error("border_color must be color code #ffffff");
  }),
];

export const addJokeValidator = [
  // body("type_id").trim().notEmpty().withMessage("type_id is required"),
  body("cat_id").trim().notEmpty().withMessage("cat_id is required"),
  body("content")
    .trim()
    .custom((value) => {
      const content = JSON.parse(value);
      if (typeof content === "object" && content !== null) return true;
      else throw new Error("content is not a valid JSON");
    }),
];

export const updateJokeValidator = [
  // body("type_id").trim().notEmpty().withMessage("type_id is required"),
  param("id").trim().notEmpty().withMessage("id is required"),
  body("cat_id").trim().notEmpty().withMessage("cat_id is required"),
  body("content")
    .trim()
    .custom((value) => {
      const content = JSON.parse(value);
      if (typeof content === "object" && content !== null) return true;
      else throw new Error("content is not a valid JSON");
    }),
];
