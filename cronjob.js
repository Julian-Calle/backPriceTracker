const cron = require("node-cron");
const { getItemsService, updateItemService, getPrice } = require("./services");
const updateItemsTask = cron.schedule("* * 1 * * *", async () => {
  console.log("Updating items");
  // const listItems = await getItemsService();
  // console.log({ listItems });
  // listItems.map(async (item) => {
  //   setTimeout(async () => {
  //     await updateItemService(item);
  //   }, 50000);
  // });
});

module.exports = { updateItemsTask };

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
