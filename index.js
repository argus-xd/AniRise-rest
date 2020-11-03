const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./app/routes")(app, {});

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

app.listen(port, () => {
  console.log("We are live on " + port);
});
