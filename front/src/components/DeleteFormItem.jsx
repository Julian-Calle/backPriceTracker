import React from "react";
import { useForm } from "react-hook-form";
import "../CSS/deleteFormItem.css";

export default function DeleteFormItem({
  deleteItem,
  updateItemList,
  desactivateFormModal,
}) {
  const { register, errors, handleSubmit } = useForm();
  const { REACT_APP_PASSWORD } = process.env;
  const checkPassword = (data) => {
    if (data.password === REACT_APP_PASSWORD) {
      deleteItem();
      setInterval(() => {
        updateItemList();
      }, 1000);
      desactivateFormModal();
    }
  };

  return (
    <div>
      <form className="delteItemForm" onSubmit={handleSubmit(checkPassword)}>
        <p>¿Estás seguro?</p>
        <p>Esta acción no podrá ser revertida</p>
        <br></br>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="deleteFormPassword"
            ref={register({ required: true, minLength: 4 })}
          />
          {errors.task && (
            <p className="messageError">*Es obligatorio introducir una tarea</p>
          )}
        </div>
        <button className="okButton">Aceptar</button>
      </form>
    </div>
  );
}
