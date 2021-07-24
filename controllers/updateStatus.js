const cheerio = require("cheerio");
const request = require("request");

const updateStatus = async (req, res, next) => {
  let connection;
  let itemPrice;

  try {
    connection = await req.app.locals.getDB();
    const { id } = req.params;

    setTimeout(() => {
      request(req.selectedItem.url, async (err, resp, body) => {
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
          [req.selectedItem.id]
        );

        const lastItemPrice = searchLastItemPrice[0].price;

        //si es diferente al último se valora si es el menor precio. De ser así se envía

        if (lastItemPrice !== itemPrice) {
          const [searchCurrentMinItemPrice] = await connection.query(
            `
            SELECT MIN(price) "minPrice" FROM status WHERE itemID= ? Limit 1`,
            [req.selectedItem.id]
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
            [itemPrice, req.selectedItem.id]
          );
        }

        //un correo a quien pidio el seguimiento del producto

        res.send({
          status: "ok",
          data: `Item ${req.selectedItem.id} actualizado`,
        });
      });
    }, 20000);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = updateStatus;
