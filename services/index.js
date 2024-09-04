const getDB = require("../db");
const { getItemsQuery } = require("./../queries");
const { sendMail } = require("../helpers");
const cheerio = require("cheerio");
const request = require("request");
const puppeteer = require("puppeteer");

async function getItemsService() {
  let connection;
  // const price = await getItemPrice(itemOK.url);
  // const name = await getItemName(itemOK.url);

  // console.log({ price });
  // console.log({ name });
  try {
    const connection = await getDB();
    // obtengo la lista de items
    const [listItems] = await connection.query(getItemsQuery);
    return listItems.map((item) => {
      return {
        id: item.id,
        name: item.name,
        photo: item.photo,
        url: item.url,
        email: item.email,
      };
    });
  } catch (error) {
    throw Error(error.message);
  } finally {
    if (connection) connection.release();
  }
}

async function updateItemService(item) {
  console.log({ item });
  let connection;
  let itemPrice;

  try {
    const connection = await getDB();
    // setTimeout(() => {
    request(item.url, async (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        const $ = cheerio.load(body);
        $("meta[itemprop ='price']", ".price-and-availability").each(
          function () {
            itemPrice = Number($(this).attr("content"));
            console.log({ itemPrice });
          }
        );
      }

      //se compara con el último, si es igual no se hace nada.
      const [searchLastItemPrice] = await connection.query(
        `
          SELECT price FROM status where id = (SELECT MAX(id) FROM status WHERE itemID= ?)`,
        [item.id]
      );
      if (!!itemPrice) {
        return "ya no existe";
      }
      const lastItemPrice = searchLastItemPrice[0].price;
      console.log({ lastItemPrice });
      //si es diferente al último se valora si es el menor precio. De ser así se envía

      if (lastItemPrice !== itemPrice) {
        const [searchCurrentMinItemPrice] = await connection.query(
          `
              SELECT MIN(price) "minPrice" FROM status WHERE itemID= ? Limit 1`,
          [item.id]
        );
        const currentMinItemPrice = searchCurrentMinItemPrice[0].minPrice;
        // console.log(currentMinItemPrice);
        console.log({ currentMinItemPrice });

        if (itemPrice < currentMinItemPrice) {
          const to = item.email;
          const subject = `El precio ha bajado`;
          const body = `El precio de "${item.name}" ha bajado hasta ${itemPrice} €. Apresúrate a comprarlo en el siguiente link: `;
          const url = item.url;
          console.log("nuevo precio", itemPrice);
          //un correo a quien pidio el seguimiento del producto
          sendMail({
            to,
            subject,
            body,
            name: "Tracker",
            introMessage: "Hola",
            url,
          });
        }

        //añadir el nuevo status
        if (!!itemPrice) {
          await connection.query(
            `
                  INSERT INTO status (price, date, itemId) VALUES(?,CURDATE(),?)`,
            [itemPrice, item.id]
          );
        }
      }
      console.log({ item: itemPrice });
      const result = {
        status: "ok",
        data: `Item ${item.id} actualizado`,
        price: `Precio actual es ${itemPrice}`,
        email: `Contacto de referencia:${item.email}`,
      };
      console.log({ result });
      return result;
    });
    // }, 2000);
  } catch (error) {
    throw Error;
  } finally {
    if (connection) connection.release();
  }
}

const itemOK = {
  id: 165,
  name: "beyerdynamic TG H56 tan (TG)",
  photo:
    "https://thumbs.static-thomann.de/thumb/orig/pics/bdb/383815/11914716_800.jpg",
  url: "https://www.thomann.de/es/beyerdynamic_tg_h56_tan_tg.htm",
  email: "jcallecristancho@gmail.com",
};
const itemNAK = {
  id: 25,
  name: "Audix D4",
  photo:
    "https://thumbs.static-thomann.de/thumb/orig/pics/bdb/160141/7432948_800.jpg",
  url: "https://www.thomann.de/es/audix_d4_spezialmikro.htm",
  email: "jcallecristancho@gmail.com",
};

// meta[itemprop ='price'].price-and-availability
const getItemPrice = async (url) => {
  console.log("item--------------------");
  console.log({ url });
  console.log("item--------------------");
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const webItem = await page.evaluate(() => {
    const itemTag = document.querySelector("div.price");
    return itemTag.innerText;
  });

  await browser.close();
  const price = Number(webItem.slice(0, -2));
  return price;
};

const getItemName = async (url) => {
  console.log("item--------------------");
  console.log({ url });
  console.log("item--------------------");
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const webItem = await page.evaluate(() => {
    const itemTag = document.querySelector(
      "h1[itemprop ='name'].product-title__title"
    );
    return itemTag.innerText;
  });

  await browser.close();
  return webItem;
  r;
};

module.exports = {
  getItemsService,
  updateItemService,
};
