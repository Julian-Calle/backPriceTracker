import React, { useState } from "react";
import PriceChart from "./PriceChart";
import Item from "./Item";
import "../CSS/itemContainer.css";

export default function ItemContainer({
  name,
  photo,
  timeline,
  url,
  deleteItem,
}) {
  const [activeChart, setActiveChart] = useState("hide");
  const [activephoto, setActivePhoto] = useState("show");

  const showChart = () => {
    setActiveChart("show");
    setActivePhoto("hide");
  };

  const hideChart = () => {
    setActivePhoto("show");
    setActiveChart("hide");
  };
  // console.log(timeline[timeline.length - 1]);
  return (
    <div className="itemContainer">
      {/* <img className={activephoto} onClick={showChart} src={photo} alt="item" /> */}
      <Item
        // onClick={showChart}

        activephoto={activephoto}
        name={name}
        photo={photo}
        timeline={timeline}
        url={url}
        showChart={showChart}
        deleteItem={deleteItem}
      />
      <PriceChart
        optionClass={activeChart}
        hideChart={hideChart}
        timeline={timeline}
        name={name}
      />
      {/* <div onClick={hideChart} className="itemInformation">
        <h1> {name}</h1>
        <h3>{`${timeline[timeline.length - 1].price} €`}</h3>
      </div> */}
    </div>
  );
}
