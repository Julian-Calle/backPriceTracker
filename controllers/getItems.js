const { getItemsService } = require("./../services");

const getItems = async (req, res, next) => {
  // const { PUBLIC_HOST, UPLOADS_DIRECTORY } = process.env;
  const connection = await req.app.locals.getDB();
  try {
    const listItemsWithPhoto = await getItemsService();

    //itero la lista para añadirle al resultado anterios las fechas y precios correspondientes
    // console.log(listItemsWithPhoto.length);
    for (let i = 0; i < listItemsWithPhoto.length; i++) {
      const [statusList] = await connection.query(
        `
        SELECT date, price FROM status  WHERE itemId =? order by 1 ASC 
        `,
        [listItemsWithPhoto[i].id]
      );
      // console.log(statusList);

      const test = statusList.map((item) => {
        return { date: item.date, price: item.price };
      });

      listItemsWithPhoto[i].timeline = test;
    }

    res.send({
      status: "ok",
      data: listItemsWithPhoto,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getItems;
