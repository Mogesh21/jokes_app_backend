import db from "../config/db.js";

const App = {
  getApps: async () => {
    try {
      const query = "SELECT * FROM apps WHERE deleted_at IS null";
      const [result] = await db.query(query, []);
      console.log(result)
      const formattedData = result.map((app) => ({
        ...app,
        categories: JSON.parse(app.categories),
      }));
      return formattedData;
    } catch (err) {
      throw err;
    }
  },

  getAppById: async (id) => {
    try {
      const query = "SELECT * FROM apps WHERE id = ? AND deleted_at IS null";
      const [result] = await db.query(query, [id]);
      const formattedData = result.map((app) => ({
        ...app,
        categories: JSON.parse(app.categories),
      }));
      return formattedData;
    } catch (err) {
      throw err;
    }
  },

  addApp: async ({ name, categories }) => {
    try {
      const query = "INSERT INTO apps (name, categories) values (?, ?)";
      const [result] = await db.query(query, [name, JSON.stringify(categories)]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateApp: async ({ id, name, categories }) => {
    try {
      const query = "UPDATE apps SET  name = ?, categories = ? WHERE id = ?";
      const [result] = await db.query(query, [name, JSON.stringify(categories), id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteApp: async (id) => {
    try {
      const query = "UPDATE apps SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
      const [result] = await db.query(query, [id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};

export default App;
