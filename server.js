require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // Solo modo developer
// const bodyParser = require("body-parser"); Obsoleto
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const getDB = require("./db");
const cors = require("cors");
const path = require("path");

// #################################################################
// #             Importamos controllers y middlewares              #
// #################################################################

const addItem = require("./controllers/addItem");
const deleteItem = require("./controllers/deleteItem");
const getItems = require("./controllers/getItems");
const updateStatus = require("./controllers/updateStatus");
const ifItemExist = require("./middlewares/ifItemExist");

// #################################################################
// #                      Configuramos express                     #
// #################################################################

// Creamos la app de express
const app = express();
// Guardamos db en el local de express
app.locals.getDB = getDB;
// Body parser (body en JSON)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(bodyParser.json());
// Cors (permite peticiones externas)
app.use(cors());

//Archivos estaticos (habilitar carpeta uploads)
// app.use(express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static("../front/build"));
app.use(express.static("front/build"));
// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());
// Logger (solo se empleará durante el desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ###################################################
// #                     Endpoints                   #
// ###################################################

//URL ejemplo: http://localhost:3000/new
app.post("/", (req, res) => {
  res.send("helaaa");
});

//POST - Añadir un item
//URL ejemplo: http://localhost:3000/new
app.post("/new", addItem);

//DELETE - Eliminar un item
//URL ejemplo: http://localhost:3000/:id
app.delete("/delete/:id", ifItemExist, deleteItem);

//GET - Solicitar listado de actualicaciones
//URL ejemplo: http://localhost:3000/items
app.get("/items", getItems);

//GET - Solicitar listado de actualicaciones
//URL ejemplo: http://localhost:3000/update:id
app.post("/update/:id", ifItemExist, updateStatus);

// #################################################################
// #                 Endpoints not found y error                   #
// #################################################################

// Middleware de error
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT} 🚀`);
});
