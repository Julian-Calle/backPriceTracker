const cheerio = require("cheerio");
const request = require("request");
const getDB = require("../db");
const autoUpdate = async () => {
  let connection;
  let itemPrice;
  let listItems;

  try {
    // const { id } = req.params;
    connection = await getDB();
    // setInterval(async () => {
    [listItems] = await connection.query(
      `
    SELECT id,url from items;

    `
    );
    // const arrayITems = listItems.map((item) => {
    //   return item.id;
    // });
    console.log(listItems);
    // }, 5000);
    const updateValues = listItems.map((item) => {
      console.log(item.url);
      console.log(item.id);
      request(item.url, async (err, resp, body) => {
        if (!err && resp.statusCode === 200) {
          const $ = cheerio.load(body);
          $("meta[itemprop ='price']", ".price-and-availability").each(
            function () {
              itemPrice = Number($(this).attr("content"));
            }
          );
        }

        //se compara con el último, si es igual no se hace nada.
        const [searchLastItemPrice] = await connection.query(
          `
    SELECT price FROM status where id = (SELECT MAX(id) FROM status WHERE itemID= ?)`,
          [item.id]
        );

        const lastItemPrice = searchLastItemPrice[0].price;

        //si es diferente al último se valora si es el menor precio. De ser así se envía

        if (lastItemPrice !== itemPrice) {
          const [searchCurrentMinItemPrice] = await connection.query(
            `
        SELECT MIN(price) "minPrice" FROM status WHERE itemID= ? Limit 1`,
            [item.id]
          );
          const currentMinItemPrice = searchCurrentMinItemPrice[0].minPrice;
          // console.log(currentMinItemPrice);

          if (itemPrice < currentMinItemPrice) {
            // console.log("nuevo menor precio y enviar correo");
          }

          //añadir el nuevo status

          await connection.query(
            `
          INSERT INTO status (price, date, itemId) VALUES(?,CURDATE(),?)`,
            [itemPrice, item.id]
          );
        }

        //un correo a quien pidio el seguimiento del producto

        // res.send({
        //   status: "ok",
        //   data: `Item ${item.id} actualizado`,
        // });
      });
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = autoUpdate;
