import logo from "./logo.svg";
import "./App.css";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import React, { useEffect, useState } from "react";
import { getItems, updateItem } from "./https/request.js";

function App() {
  const [itemsInfo, setItemsInfo] = useState([]);

  async function getItemsInfo() {
    const ItemList = await getItems();
    // console.log(ItemList.data);
    console.log(ItemList);
    setItemsInfo(ItemList);
  }
  useEffect(() => {
    getItemsInfo();
  }, []);
  const onceADay = 86400000;
  const everyTenHours = 360000000;
  const updater = setInterval(() => {
    itemsInfo.map((item) => {
      updateItem(item.id);
    });
    getItemsInfo();
    console.log("ACTUALIZOOOOO");
  }, 600000);
  return (
    <div className="mainContainer">
      <section className="addITem">
        <AddItemForm update={getItemsInfo} />
      </section>

      <section className="itemListSection">
        <ItemList itemsInfo={itemsInfo} setItemsInfo={setItemsInfo} />
      </section>
    </div>
  );
}

export default App;
