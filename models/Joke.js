import db from "../config/db.js";

const Joke = {
  getJokes: async (limit = 1000000, joke_id = 0) => {
    try {
      const query = `SELECT 
          j.id, j.cat_id, c.type_id, c.name as cat_name, j.subcat_id, IFNULL(s.name, '') as subcat_name, j.content, IFNULL(s.color, c.color) as color, IFNULL(s.border_color, c.border_color) as border_color
        FROM
         jokes j 
        LEFT JOIN 
          categories c ON c.id = j.cat_id 
        LEFT JOIN 
          subcategories s ON j.subcat_id = s.id 
        WHERE j.id > ? AND j.deleted_at IS NULL AND JSON_VALID(j.content) LIMIT ?`;
      const [result] = await db.query(query, [joke_id, limit]);
      const formattedResult = result.map((record) => {
        let content = record.content;
        if (typeof content === "string") {
          try {
            content = JSON.parse(content); // first parse
            if (typeof content === "string") {
              content = JSON.parse(content); // second parse if still string
            }
          } catch (e) {
            console.warn("Failed to parse content for joke ID:", record.id, e);
            content = null; // or keep original content
          }
        }
        return { ...record, content };
      });
      return formattedResult;
    } catch (err) {
      throw err;
    }
  },

  getJokeByCatId: async (cat_id, joke_id) => {
    try {
      const last_id = joke_id ? joke_id : 0;
      const limit = 500;
      const query = `SELECT 
                        j.id, c.type_id, j.cat_id, c.name as cat_name, j.subcat_id, IFNULL(s.name, '') as subcat_name, j.content, c.color, c.border_color
                    FROM
                        jokes j
                    LEFT JOIN 
                        subcategories s ON j.subcat_id = s.id
                    INNER JOIN 
                        categories c ON c.id = j.cat_id 
                    WHERE 
                        j.cat_id = ? 
                        AND j.id > ?
                        AND JSON_VALID(j.content)
                        AND j.deleted_at is NULL
                    LIMIT ?`;
      const [result] = await db.query(query, [cat_id, last_id, limit]);
      console.log(result[0]?.content, typeof result[0]?.content);
      const formattedResult = result.map((record) => {
        let content = record.content;
        if (typeof content === "string") {
          try {
            content = JSON.parse(content); // first parse
            if (typeof content === "string") {
              content = JSON.parse(content); // second parse if still string
            }
          } catch (e) {
            console.warn("Failed to parse content for joke ID:", record.id, e);
            content = null; // or keep original content
          }
        }
        return { ...record, content };
      });
      return formattedResult;
    } catch (err) {
      throw err;
    }
  },

  getJokeBySubCatId: async (subcat_id, joke_id) => {
    try {
      const last_id = joke_id ? joke_id : 0;
      const limit = 500;
      const query = `SELECT 
                        j.id, c.type_id, j.cat_id, c.name as cat_name, j.subcat_id, IFNULL(s.name, '') as subcat_name, j.content, s.color, s.border_color
                    FROM 
                        jokes j
                    INNER JOIN 
                        subcategories s ON j.subcat_id = s.id
                    INNER JOIN 
                        categories c ON c.id = s.cat_id
                    WHERE 
                        j.subcat_id = ? 
                        AND j.id > ?
                        AND JSON_VALID(j.content)
                        AND j.deleted_at IS NULL
                    LIMIT ?`;
      const [result] = await db.query(query, [subcat_id, last_id, limit]);
      const formattedResult = result.map((record) => {
        let content = record.content;
        if (typeof content === "string") {
          try {
            content = JSON.parse(content);
            if (typeof content === "string") {
              content = JSON.parse(content);
            }
          } catch (e) {
            console.warn("Failed to parse content for joke ID:", record.id, e);
            content = null;
          }
        }
        return { ...record, content };
      });
      return formattedResult;
    } catch (err) {
      throw err;
    }
  },

  getJokeById: async (joke_id) => {
    try {
      const query = `SELECT 
                        j.id, c.type_id, j.cat_id, j.subcat_id, j.content
                    FROM
                        jokes j
                    INNER JOIN 
                        categories c ON c.id = j.cat_id 
                    WHERE 
                        j.id = ?
                        AND JSON_VALID(j.content)
                        AND j.deleted_at is NULL`;
      const [result] = await db.query(query, [joke_id]);
      const formattedResult = result.map((record) => ({
        ...record,
        content: JSON.parse(record.content),
      }));
      return formattedResult;
    } catch (err) {
      throw err;
    }
  },

  addJokes: async (data) => {
    try {
      let query = "INSERT INTO jokes (cat_id, subcat_id, content) VALUES";
      const values = [];
      const params = [];
      data.map((joke) => {
        values.push("(?, ?, ?)");
        const content =
          typeof joke.content === "string" ? joke.content : JSON.stringify(joke.content);
        params.push(joke.cat_id);
        params.push(joke.subcat_id);
        params.push(content);
      });
      const placeHolder = values.join(", ");
      query += placeHolder;
      const [result] = await db.query(query, params);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  updateJoke: async ({ id, cat_id, subcat_id, content }) => {
    try {
      const query = "UPDATE jokes SET cat_id = ?, subcat_id = ?, content = ? WHERE id = ?";
      const [result] = await db.query(query, [cat_id, subcat_id, JSON.stringify(content), id]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  deleteJoke: async (id) => {
    try {
      const [data] = await Joke.getJokeById(id);
      const query = "DELETE FROM jokes WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return [result.affectedRows, data];
    } catch (err) {
      throw err;
    }
  },
};

export default Joke;
