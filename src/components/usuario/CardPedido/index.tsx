"use client";

import style from "./CardPedido.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CardPedido = ({ data }: any) => {
  // console.log(" COMPONENT ", data);
  const { fecha, estado, entrega, direccion_entrega, id_pedido } = data;
  const router = useRouter();

  const click = () => {
    router.push(`/usuario/DetallePedido/${id_pedido}`);
  };

  return (
    <section className={style.section} onClick={() => click()}>
      <span>
        Fecha:{" "}
        <span className={style.info}>
          {" "}
          {new Date(fecha).toLocaleDateString("es-MX")}
        </span>
      </span>
      <span>
        Estado:
        <span className={style.info}> {estado}</span>
      </span>
      {entrega !== "tienda" && (
        <span>
          Dirección: <span className={style.info}>{direccion_entrega}</span>
        </span>
      )}
    </section>
  );
};

export default CardPedido;
