import React, { useEffect, useState } from "react";
import "../CSS/itemList.css";
import ItemContainer from "./ItemContainer";
// import { updateItem } from "../https/request.js";
export default function ItemList({ itemsInfo, setItemsInfo, deleteItem }) {
  // const [itemsInfo, setItemsInfo] = useState([]);
  // const updater = setInterval(() => {
  //   console.log("ACTUALIZOOOOO");
  //   itemsInfo.map((item) => {
  //     updateItem(item.id);
  //   });
  // }, 2000);
  return (
    <div className="charContainer">
      {itemsInfo?.length &&
        itemsInfo.map((item) => {
          return (
            <ItemContainer
              key={item.id}
              name={item.name}
              photo={item.photo}
              url={item.url}
              timeline={item.timeline}
              deleteItem={() => {
                deleteItem(item.id);
              }}
            />
          );
        })}
    </div>
  );
}
