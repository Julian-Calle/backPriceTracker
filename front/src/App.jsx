import "./App.css";
import ItemList from "./components/ItemList";

import AddItemForm from "./components/AddItemForm";
import React, { useEffect, useState } from "react";
import { getItems, updateItem, deleteItem } from "./https/request.js";

function App() {
  const [itemsInfo, setItemsInfo] = useState([]);
  // const [activeDeleteFormItem, setActiveDeleteFormItem] = useState(false);
  const hours = 3600000 * 24;
  async function getItemsInfo() {
    const ItemList = await getItems();
    setItemsInfo(ItemList);
  }
  useEffect(() => {
    getItemsInfo();
  }, []);

  setInterval(() => {
    itemsInfo.forEach((item) => {
      updateItem(item.id);
    });
    getItemsInfo();
    console.log("ACTUALIZOOOOO");
  }, hours);
  return (
    <>
      <div className="mainContainer">
        <div className="title">
          <h1>Juugle Thomann price tracker</h1>
        </div>
        <section className="addItem">
          <AddItemForm update={getItemsInfo} />
        </section>

        <section className="itemListSection">
          <ItemList
            itemsInfo={itemsInfo}
            setItemsInfo={setItemsInfo}
            deleteItem={deleteItem}
            updateItemList={getItemsInfo}
          />
        </section>
      </div>
    </>
  );
}

export default App;
