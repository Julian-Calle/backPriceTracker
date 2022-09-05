require("dotenv").config();
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const morgan = require("morgan"); // Solo modo developer
// const bodyParser = require("body-parser"); Obsoleto
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const getDB = require("./db");
const cors = require("cors");
const path = require("path");
const pathApi = process.env.PUBLIC_HOST;

// #################################################################
// #                      Configuramos Swagger                     #
// #################################################################
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: `API was mented to be used for tracking products from [Thomann website](https://www.thomann.de/es/index.html). 
      In the following interactive End points you can test this API.
      There is a basic example of front application [HERE](https://juuglepricetracker.vercel.app/).
      `,
      contact: {
        email: "jcallecristancho@gmail.com",
      },
      title: " Price tracker API",
      version: "1.0.0",
    },
    host: pathApi,
    tags: [
      {
        name: "End Points",
        description: " List of options to track items in Thomann website",
        externalDocs: {
          description: "Check the code",
          url: "https://github.com/Julian-Calle/price_tracker",
        },
      },
    ],
    externalDocs: {
      description: "You can check the repository of this API HERE ",
      url: "https://github.com/Julian-Calle/price_tracker",
    },
  },
  apis: ["server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
// app.use(express.static("./front/build"));
// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());
// Logger (solo se empleará durante el desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// ###################################################
// #                     Endpoints                   #
// ###################################################

//URL ejemplo: http://localhost:3000/new
app.get("/", (req, res) => {
  res.send("Price tracker api");
});

// setInterval(autoUpdate, 60000);
// *     summary: Add a new item into the tracked items.
// *      consumes:
// *       - application/json
// *           name: user
//POST - Añadir un item
//URL ejemplo: http://localhost:3000/new
/**
 * @swagger
 * /new:
 *    post:
 *      tags:
 *      - "End Points"
 *      summary: "Add item"
 *      description: Add a new item into the tracked items
 *      parameters:
 *         - in: body
 *           name: body
 *           description: URL and email to set the item that will be tracked.
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *                url:
 *                   type: string
 *                   description: Full url from Thomann website
 *                email:
 *                   type: string
 *                   description: Full email of the person interest on tracking the item
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 */
app.post("/new", addItem);

/**
 * @swagger
 * /delete/{id}:
 *    delete:
 *      tags:
 *      - "End Points"
 *      summary: "Delete item"
 *      description: Delete item into the tracked items
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *             required: true
 *             description: ID of the item
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 */
//DELETE - Eliminar un item
//URL ejemplo: http://localhost:3000/:id
app.delete("/delete/:id", ifItemExist, deleteItem);

//GET - Solicitar listado de actualicaciones
//URL ejemplo: http://localhost:3000/items

/**
 * @swagger
 * /items:
 *    get:
 *      tags:
 *      - "End Points"
 *      summary: "Get list of items"
 *      description: Get all the items that are being tracked
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 */
app.get("/items", getItems);

/**
 * @swagger
 * /update/{id}:
 *    post:
 *      tags:
 *      - "End Points"
 *      summary: "Update price of item"
 *      description: Update the price of the item
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *             required: true
 *             description: ID of the item
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 */
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
