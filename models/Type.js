import db from "../config/db.js";

const Type = {
  getTypes: async () => {
    try {
      const query = "SELECT * FROM types WHERE deleted_at is NULL";
      const [result] = await db.query(query, []);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getTypeById: async (id) => {
    try {
      const query = "SELECT * FROM types WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  addType: async ({ name, conversation, joke, joke_image, text_answer, image_answer }) => {
    try {
      const query =
        "INSERT INTO types (name, conversation, joke, joke_image, text_answer, image_answer) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await db.query(query, [
        name,
        conversation,
        joke,
        joke_image,
        text_answer,
        image_answer,
      ]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateType: async ({ id, name, conversation, joke, joke_image, text_answer, image_answer }) => {
    try {
      const query =
        "UPDATE types SET name = ?, conversation = ?, joke = ?, joke_image = ?, text_answer = ?, image_answer = ? WHERE id = ?";
      const [result] = await db.query(query, [
        name,
        conversation,
        joke,
        joke_image,
        text_answer,
        image_answer,
        id,
      ]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteType: async (id) => {
    try {
      const query = "UPDATE types SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default Type;
