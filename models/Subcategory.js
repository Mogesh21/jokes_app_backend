import db from "../config/db.js";

const Subcategory = {
  getSubCategories: async () => {
    try {
      const query =
        "SELECT s.id, s.cat_id, c.name as cat_name, s.name, s.color, s.border_color, s.cover_image FROM subcategories s LEFT JOIN categories c ON s.cat_id = c.id WHERE s.deleted_at IS NULL";
      const [result] = await db.query(query, []);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getSubCategoryById: async (cat_id) => {
    try {
      const query =
        "SELECT id, cat_id, name, color, border_color, cover_image FROM subcategories WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [cat_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getSubCategoriesByCatId: async (cat_id, last_subcat_id = 0) => {
    try {
      const query =
        "SELECT id, cat_id, name, color, border_color, cover_image FROM subcategories WHERE cat_id = ? AND id > ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [cat_id, last_subcat_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  addSubCategory: async ({ cat_id, name, color, border_color, cover_image }) => {
    try {
      const query =
        "INSERT INTO subcategories (cat_id, name, color, border_color, cover_image) VALUES (?, ?, ?, ?, ?)";
      const [result] = await db.query(query, [cat_id, name, color, border_color, cover_image]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateSubCategory: async ({ id, cat_id, name, color, border_color, cover_image }) => {
    try {
      const query =
        "UPDATE subcategories SET cat_id = ?, name = ?, color = ?, border_color = ?, cover_image = ? WHERE id = ?";
      const [result] = await db.query(query, [cat_id, name, color, border_color, cover_image, id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteSubCategory: async (id) => {
    try {
      const [data] = await Subcategory.getSubCategoryById(id);
      const query =
        "UPDATE subcategories SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [id]);
      return [result.affectedRows, data];
    } catch (err) {
      throw err;
    }
  },
};

export default Subcategory;
