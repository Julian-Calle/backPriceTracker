require("dotenv").config();
const getDB = require("./db.js");
const fs = require("fs").promises;

if (process.env.NODE_ENV !== "development") process.exit();

let connection;

async function main() {
  try {
    connection = await getDB();

    //leer script sql
    console.log("Leyendo BBDD");
    const sqlScript = await (
      await fs.readFile("./BBDD/scriptBBDD.sql")
    ).toString();
    await connection.query(sqlScript);

    console.log("************************************************");
    console.log("* BBDD cargado, iniciando creación de datos... *");
    console.log("************************************************");

    await connection.query(`
INSERT INTO items (name,photo,url,email)
VALUES 
    ("piano","https://thumbs.static-thomann.de/thumb/orig/pics/bdb/136746/106439_800.jpg","https://www.thomann.de/es/yamaha_gb1k_schwarz_poliert.htm","jcallecristancho@gmail.com"),
    ("guitarra","https://thumbs.static-thomann.de/thumb/orig/pics/prod/410797.jpg","https://www.thomann.de/es/harley_benton_gs_travel_e_mahogany.htm","jcallecristancho@gmail.com"),
    ("microfono","https://thumbs.static-thomann.de/thumb/orig/pics/bdb/160142/14740626_800.jpg","https://www.thomann.de/es/audix_d6_bassdrummikro.htm","jcallecristancho@gmail.com")
    `);

    await connection.query(`
INSERT INTO status (price, date,itemId)
VALUES (100,"2021-01-01",1),
(150,"2021-01-02",1),
(200,"2021-01-03",1),
(300,"2021-02-01",2),
(250,"2021-02-02",2),
(200,"2021-02-03",2),
(50,"2021-03-01",3),
(10,"2021-03-02",3),
(80,"2021-03-03",3)
`);

    //añadir valores a tablas
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
