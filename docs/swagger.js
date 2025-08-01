import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Joke App API",
    description: "Auto-generated Swagger UI for Joke App",
  },
  host: "192.168.100.177:8010",
  // host: "jokesapp.skyraantech.com/server",
  schemes: ["http"],
  tags: [
    {
      name: "API",
      description: "Endpoints for Flutter app",
    },
    {
      name: "Types",
      description: "Endpoints related to types",
    },
    {
      name: "Categories",
      description: "Endpoints for joke categories",
    },
    {
      name: "Sub Categories",
      description: "Endpoints for joke sub categories",
    },
    {
      name: "Jokes",
      description: "Endpoints for jokes",
    },
    {
      name: "Apps",
      description: "Endpoints for apps",
    },
    {
      name: "Users",
      description: "Endpoints for Admin users",
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../app.js"];
swaggerAutogen()(outputFile, endpointsFiles, doc);
