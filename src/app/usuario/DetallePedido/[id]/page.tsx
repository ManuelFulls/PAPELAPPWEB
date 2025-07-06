"use client";

import style from "./DetallePedido.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import UseNavbar from "@/components/usuario/UseNavbar";
import CardDetallePedido from "@/components/usuario/CardDetallePedido";
import { useParams, useRouter } from "next/navigation";
import { IconRegresar } from "@/app/lib/Icon";
import toast from "react-hot-toast";

export default function DetallePedido() {
  const params = useParams();
  const router = useRouter();

  const id_pedido = params?.id;

  const [detallePedido, setDetallePedido] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const info = await axios.get("/api/data/user/entrega/detaPedidos", {
        params: { id_pedido: id_pedido },
      });
      // console.log(info.data.data);
      setDetallePedido(info.data.data);
    };

    getData();
  }, []);
  const totalPedido = detallePedido.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );

  const MarcarRecibido = async () => {
    const res = await axios.post("/api/data/user/pedido/recibido", {
      id_pedido: id_pedido,
    });

    if (res.status === 200) {
      toast.success("¡Muchas Gracias por su Preferencia!");
      router.push("/usuario/Pedidos");
    } else {
      toast.error("Algio salio mal, intente de nuevo");
    }
  };

  return (
    <>
      <UseNavbar />
      <main className={style.main}>
        <span
          className={style.regresar}
          onClick={() => router.push("/usuario/Pedidos")}
        >
          <IconRegresar />
        </span>
        <span className={style.title}>Detalles del Pedido</span>
        <span className={style.price}>Total del Pedido ${totalPedido}</span>
        <button className="btn2" onClick={() => MarcarRecibido()}>
          Marcar como Recibido
        </button>
        <article className={style.article}>
          {detallePedido.length > 0 ? (
            detallePedido.map((producto, index) => (
              <CardDetallePedido key={index} data={producto} />
            ))
          ) : (
            <p>No hay productos en este pedido.</p>
          )}
        </article>
      </main>
    </>
  );
}
