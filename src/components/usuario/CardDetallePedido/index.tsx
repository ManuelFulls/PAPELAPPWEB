"use client";

import style from "./CardDetallePedido.module.css";
import { useState } from "react";
import { useParams } from "next/navigation";

const CardDetallePedido = ({ data }: any) => {
  //console.log(" PRODUCTO ", data);
  const { cantidad, imagen, precio, descripcion_producto, nombre_producto } =
    data;
  return (
    <section className={style.section}>
      <div className={style.head}>
        <span>{nombre_producto}</span>
        <img className={style.img} src={imagen} alt="Libreta" />
      </div>
      <div className={style.info}>
        <span>
          Cantidad: <span className={style.text}>{cantidad}</span>
        </span>
        <span>
          Precio: <span className={style.text}>${precio}</span>
        </span>
        <span className={style.text}>{descripcion_producto}</span>
      </div>
    </section>
  );
};

export default CardDetallePedido;
