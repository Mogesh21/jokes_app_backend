import db from "../config/db.js";

const Category = {
  getAllCategories: async () => {
    try {
      const query =
        "SELECT c.id, c.name, c.type_id, c.color, c.border_color, c.cover_image, c.has_subcategory, c.version, t.joke, t.joke_image, t.conversation, t.text_answer, t.image_answer FROM categories c LEFT JOIN types t ON t.id = c.type_id where c.deleted_at is NULL";
      const [result] = await db.query(query, []);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getCategoryById: async (id) => {
    try {
      const query =
        "SELECT c.id, c.name, c.type_id, c.color, c.border_color, c.cover_image, c.has_subcategory, c.version, t.joke, t.joke_image, t.conversation, t.text_answer, t.image_answer FROM categories c LEFT JOIN types t ON t.id = c.type_id where c.id = ? AND c.deleted_at is NULL";
      const [result] = await db.query(query, id);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getCategoryByAppId: async (app_id, last_cat_id = 0) => {
    const query = `SELECT 
                      c.id, c.type_id, c.name, c.color, 
                      c.border_color, c.cover_image, c.has_subcategory, c.version,
                      t.joke, t.joke_image, t.conversation, t.text_answer, t.image_answer
                    FROM categories c
                    JOIN apps a ON JSON_UNQUOTE(JSON_EXTRACT(a.categories, '$[*]')) LIKE CONCAT('%', c.id, '%')
                    LEFT JOIN types t ON t.id = c.type_id
                    WHERE a.id = ? AND c.id > ? AND c.deleted_at IS NULL;`;
    const [result] = await db.query(query, [app_id, last_cat_id]);
    return result;
  },
  addCategory: async ({
    name,
    type_id,
    color,
    border_color,
    cover_image,
    has_subcategory,
    version,
  }) => {
    try {
      const query = `INSERT INTO categories (name, type_id, color, border_color, cover_image, has_subcategory, version) VALUES
          (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await db.query(query, [
        name,
        type_id,
        color,
        border_color,
        cover_image,
        JSON.parse(has_subcategory),
        version,
      ]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },
  updateCategory: async ({
    id,
    name,
    type_id,
    color,
    border_color,
    cover_image,
    has_subcategory,
    version,
  }) => {
    try {
      const query = `UPDATE categories SET name = ?, type_id = ?, color = ?, border_color = ?, cover_image = ?, has_subcategory = ?, version = ? WHERE id = ?`;
      const [result] = await db.query(query, [
        name,
        type_id,
        color,
        border_color,
        cover_image,
        JSON.parse(has_subcategory),
        version,
        id,
      ]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
  deleteCategory: async (id) => {
    try {
      const [data] = await Category.getCategoryById(id);
      const query = "UPDATE categories SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, id);
      return [result.affectedRows, data];
    } catch (err) {
      throw err;
    }
  },
};

export default Category;
