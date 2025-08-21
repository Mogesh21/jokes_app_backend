import express from "express";
import cors from "cors";
import { config } from "dotenv";
import appRoutes from "./routes/apps.js";
import typeRoutes from "./routes/types.js";
import categoryRoutes from "./routes/categories.js";
import subcategoryRoutes from "./routes/subcategories.js";
import jokeRoutes from "./routes/jokes.js";
import apiRoutes from "./routes/apis.js";
import userRoutes from "./routes/users.js";
import developmentRoutes from "./routes/development.js";
import { readFileSync } from "fs";
import swaggerUi from "swagger-ui-express";
const swaggerFile = JSON.parse(
  readFileSync(new URL("./docs/swagger.json", import.meta.url), "utf-8")
);

const app = express();
config();

const options = {
  customCss: `
    .topbar{
      display: none !important;
    }
    .scheme-container{
      display: none !important;
    }
    .description .markdown{
      display: none !important;
    }
    .curl-command {
      display: none !important;
    }
    .headers-wrapper {
      display: none !important;
    }
  `,
};

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("public"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

app.use("/apps", appRoutes);
app.use("/types", typeRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/jokes", jokeRoutes);
app.use("/user", userRoutes);

app.use("/api", apiRoutes);
app.use("/development", developmentRoutes);

app.use((req, res) => {
  res.redirect("/docs");
});

app.listen(process.env.PORT, () => {
  console.log(`SERVER running at ${process.env.PORT}`);
});
