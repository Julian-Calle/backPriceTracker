export default function ButtonIcon({ icon, cls, action }) {
  return (
    <button onClick={action} className={`btnContainer_${cls}`}>
      <i className={`fa fa-${icon} fa-lg ${cls}`}></i>
    </button>
  );
}
