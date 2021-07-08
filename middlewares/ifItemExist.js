const { createError } = require("../helpers");

const ifItemExist = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { id } = req.params;

    //verificar si existe. En caso de ser así se devuelve un error
    const [search] = await connection.query(
      `
    SELECT id, name, url FROM items WHERE id= ?
    `,
      [id]
    );

    if (search.length === 0) {
      throw createError("Este item NO está siendo trackeado", 400);
    }
    req.selectedItem = search[0];
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = ifItemExist;
