const getItems = async (req, res, next) => {
  const { PUBLIC_HOST, UPLOADS_DIRECTORY } = process.env;
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { user_id } = req.params;
    const { type } = req.query;
    // obtengo la lista de items
    const [listItems] = await connection.query(
      `
      SELECT id, name, photo, url FROM items

      `
    );
    // console.log(listItems);
    const ListItemsWithPhoto = listItems.map((item) => {
      return {
        id: item.id,
        name: item.name,
        // photo: `${PUBLIC_HOST}/${UPLOADS_DIRECTORY}/${item.photo}`,
        photo: item.photo,
        url: item.url,
      };
    });

    //itero la lista para añadirle al resultado anterios las fechas y precios correspondientes
    // console.log(ListItemsWithPhoto.length);
    for (let i = 0; i < ListItemsWithPhoto.length; i++) {
      const [statusList] = await connection.query(
        `
        SELECT date, price FROM status  WHERE itemId =? order by 1 ASC 
        
  
        `,
        [ListItemsWithPhoto[i].id]
      );
      // console.log(statusList);

      const test = statusList.map((item) => {
        return { date: item.date, price: item.price };
      });

      ListItemsWithPhoto[i].timeline = test;
    }

    res.send({
      status: "ok",
      data: ListItemsWithPhoto,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getItems;
