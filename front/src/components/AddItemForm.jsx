import React from "react";
import "../CSS/addItemForm.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { newItem } from "../https/request.js";

export default function AddItemForm({ update }) {
  const { register, errors, handleSubmit, reset } = useForm();

  const sendInfo = async (data) => {
    await newItem(data.url, data.email);
    reset();
    update();
  };
  return (
    <form className="addItemForm" onSubmit={handleSubmit(sendInfo)}>
      <div>
        <label className="formLabel" htmlFor="url">
          URL :
        </label>
        <div className="field">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="copia el link"
            defaultValue=""
            ref={register({ required: true, minLength: 26 })}
          />
        </div>
        {errors.url && (
          <p className="messageError">
            *Es obligatorio introducir un url correctamente
          </p>
        )}
      </div>
      <div>
        <label className="formLabel" htmlFor="email">
          email:
        </label>
        <div className="field">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="copia el email acá"
            defaultValue=""
            ref={register({ required: true, minLength: 10 })}
          />
        </div>
        {errors.email && (
          <p className="messageError">
            *Es obligatorio introducir el email correctamente
          </p>
        )}
      </div>
      <button className="formButton"> AÑADIR</button>
    </form>
  );
}
