"use client";

import style from "./Pedidos.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import UseNavbar from "@/components/usuario/UseNavbar";
import CardPedido from "@/components/usuario/CardPedido";
import { useRouter } from "next/navigation";

export default function Pedidos() {
  const [domicilio, setDomicilio] = useState([]);
  const [tienda, setTienda] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/cookie");
      const info = await axios.get("/api/data/user/entrega/info", {
        params: { id_usuario: res.data.data.id_usuario },
      });
      // console.log("RESULT ADO ", info);
      setDomicilio(info.data.domicilio[0]);
      setTienda(info.data.tienda[0]);
      // console.log(" d", info.data.domicilio[0]);
      //console.log(" d", info.data.tienda);
    };

    getData();
  }, []);

  return (
    <>
      <UseNavbar />

      <main className={style.main}>
        <article className={style.tienda}>
          <span className={style.title}>Pedidos por recoger en tienda</span>
          {tienda.length > 0 ? (
            tienda.map((pedido, index) => (
              <CardPedido key={index} data={pedido} />
            ))
          ) : (
            <p>No hay pedidos para recoger en tienda.</p>
          )}
        </article>

        <article className={style.domicilio}>
          <span className={style.title}>Pedidos a domicilio</span>
          {domicilio.length > 0 ? (
            domicilio.map((pedido, index) => (
              <CardPedido key={index} data={pedido} />
            ))
          ) : (
            <p>No hay pedidos a domicilio.</p>
          )}
        </article>
      </main>
    </>
  );
}
