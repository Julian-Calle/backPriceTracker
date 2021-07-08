const { createError, savePhoto } = require("../helpers");

const deleteItem = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { id } = req.params;

    // se eliminan todas las actualizacines de ese item

    await connection.query(
      `
    DELETE FROM status WHERE itemId=?`,
      [id]
    );

    //se elimina de la BBDD

    await connection.query(
      `
    DELETE FROM items WHERE id=?`,
      [id]
    );

    res.send({
      status: "ok",
      data: { ...req.selectedItem },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteItem;
