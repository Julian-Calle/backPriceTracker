require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // Solo modo developer
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const getDB = require("./db");
const cors = require("cors");
const swaggerDocumentation = require("./swagger.js");
// const cron = require("node-cron");
// const { getItemsService, updateItemService } = require("./services");
// const { updateItemsTask } = require("./cronjob");

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
app.use(express.static("html"));

// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());

// Logger (solo se empleará durante el desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ###################################################
// #                     Endpoints                   #
// ###################################################

//GET - pagina de inicio
//URL ejemplo: http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Price tracker api");
});

//POST - Añadir un item
//URL ejemplo: http://localhost:3000/new
app.post("/new", addItem);

//DELETE - Eliminar un item
//URL ejemplo: http://localhost:3000/delete/:id
app.delete("/delete/:id", ifItemExist, deleteItem);

//GET - Solicitar listado de actualicaciones
//URL ejemplo: http://localhost:3000/items
app.get("/items", getItems);

//POST - Solicitar actualizar un item
//URL ejemplo: http://localhost:3000/update/:id
app.post("/update/:id", ifItemExist, updateStatus);

// #################################################################
// #                            Swagger                            #
// #################################################################
app.use(swaggerDocumentation);

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
// const itemTest2 = {
//   id: 25,
//   name: "Audix D4",
//   photo:
//     "https://thumbs.static-thomann.de/thumb/orig/pics/bdb/160141/7432948_800.jpg",
//   url: "https://www.thomann.de/es/audix_d4_spezialmikro.htm",
// };

// updateItemsTask.start();
// setTimeout(() => {
//   updateItemsTask.start();
//   updateItemsTask.stop();
// }, 1000);
