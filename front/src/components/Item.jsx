import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";

export default function Item({
  photo,
  name,
  url,
  timeline,
  showChart,
  activephoto,
}) {
  return (
    <div
      id={name.split(" ").join("").trim()}
      className={`${activephoto} itemInfo`}
    >
      <img src={photo} alt={name} onClick={showChart} />
      <Router>
        <h2>
          <Link to={{ pathname: url }} target="_blank">
            {name}
          </Link>
        </h2>
      </Router>
      <h3>{`${timeline[timeline.length - 1].price} €`}</h3>
    </div>
  );
}
