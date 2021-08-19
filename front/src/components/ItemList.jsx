import React, { useState } from "react";
import Modal from "../components/Modal";
import DeleteFormItem from "../components/DeleteFormItem";
import "../CSS/itemList.css";
import ItemContainer from "./ItemContainer";
// import { updateItem } from "../https/request.js";
export default function ItemList({ itemsInfo, deleteItem, updateItemList }) {
  const [activeDeleteFormItem, setActiveDeleteFormItem] = useState(false);
  const [itemSelected, setItemSelected] = useState(0);
  return (
    <div className="charContainer">
      <Modal
        active={activeDeleteFormItem}
        title={"AVISO"}
        body={
          <DeleteFormItem
            deleteItem={() => deleteItem(itemSelected)}
            updateItemList={updateItemList}
            desactivateFormModal={() => {
              setActiveDeleteFormItem(!activeDeleteFormItem);
            }}
          />
        }
        // btnName={"Aceptar"}
        // btnAction={() => {
        //   console.log("enviar");
        // }}
        // actBtn={true}
        secBtnName={"Cancelar"}
        actSecBtn={true}
        size="medium"
        border={false}
        secBtnAction={() => setActiveDeleteFormItem(!activeDeleteFormItem)}
      />
      {itemsInfo?.length &&
        itemsInfo.map((item) => {
          return (
            <ItemContainer
              key={item.id}
              name={item.name}
              photo={item.photo}
              url={item.url}
              timeline={item.timeline}
              selectItem={() => {
                setActiveDeleteFormItem(!activeDeleteFormItem);
                setItemSelected(item.id);
              }}
              switchDeleteFormItem={() =>
                setActiveDeleteFormItem(!activeDeleteFormItem)
              }
            />
          );
        })}
    </div>
  );
}
