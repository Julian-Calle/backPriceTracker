import { Link, BrowserRouter as Router } from "react-router-dom";
import BottonIcon from "../components/BottonIcon";

export default function Item({
  photo,
  name,
  url,
  timeline,
  showChart,
  activephoto,
  selectItem,
  switchDeleteFormItem,
}) {
  return (
    <div
      id={name.split(" ").join("").trim()}
      className={`${activephoto} itemInfo`}
    >
      <BottonIcon
        // onClick={switchDeleteFormItem}
        icon="trash"
        cls="delete_btn"
        action={selectItem}
      />
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
