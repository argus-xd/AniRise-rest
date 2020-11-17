const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./router");
const oldRouter = require("./router.old");
const cacheContainer = require("./cache-container");

const { restPort } = require("./config");

(async () => {
  await cacheContainer.init();

  const app = express();

  app.use(morgan("tiny"));
  app.use(cors());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(router, oldRouter);

  app.engine(
    ".hbs",
    handlebars({
      defaultLayout: "main",
      extname: ".hbs",
      layoutsDir: path.join(__dirname, "views/layouts")
    })
  );
  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "views"));

  app.listen(restPort, () => {
    console.log("Rest API started on: " + restPort);
  });
})();
