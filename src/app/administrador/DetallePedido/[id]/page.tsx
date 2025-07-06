"use client";

import style from "./DetallePedido.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "@/components/admin/Navbar";
import { IconRegresar } from "@/app/lib/Icon";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CardDetallePedido from "@/components/usuario/CardDetallePedido";
import toast from "react-hot-toast";

export default function DetallePedido() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";
  const isDomicilio = searchParams.get("domicilio") === "true";
  const id_pedido = params?.id;

  const [cliente, setCliente] = useState<any>("");

  const [detallePedido, setDetallePedido] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const info = await axios.get("/api/data/user/entrega/detaPedidos", {
        params: { id_pedido: id_pedido },
      });
      console.log(info.data.data);
      setDetallePedido(info.data.data);
    };

    getData();
  }, []);
  const totalPedido = detallePedido.reduce(
    (acc, item) => acc + parseFloat(item.total),
    0
  );

  const regresar = () => {
    if (isAdmin === true) {
      if (isDomicilio === true) {
        router.push("/administrador/Domicilio");
      } else {
        router.push("/administrador/Tienda");
      }
    } else {
      router.push("/usuario/Pedidos");
    }
  };

  useEffect(() => {
    //EXTRAER LA INFORMACION DEL PACIENTE
    const getInfo = async () => {
      const res = await axios.get("/api/data/admin/pedidos/domicilio/cliente", {
        params: {
          id_pedido: id_pedido,
        },
      });
      console.log(" RESULTADO DEL PEDIDO", res.data.data[0]);

      //extraer los datos del cliente
      const user = res.data.data[0][0];
      // console.log(" eee ", user);

      const data = await axios.get("/api/data/user/cuenta", {
        params: { id_usuario: user.id_usuario },
      });

      //console.log("CLIENTE ", data.data.data);
      setCliente(data.data.data);
    };
    getInfo();
  }, []);

  const pagar = async () => {
    //RECOGER EN TIENDA
    //SE MARCARAN COMO PAGADO

    const res = await axios.post("/api/data/admin/pedidos/tienda", {
      id_pedido,
      estado: "pagado",
      productos: detallePedido.map(({ id_producto, cantidad }) => ({
        id_producto,
        cantidad,
      })),
    });
    // console.log(" RESUL ", res);

    if (res.status === 200) {
      toast.success("Producto pagado correctamente");
      router.push("/administrador/Tienda");
    } else {
      toast.error("Algo salio mal, intentelo de nuevo");
    }

    //SE DESCUENTAN LOS PRODUCTOS DE LA BASE DE DATOS
  };

  const enviarPedido = async () => {
    // SE MARCA EL PEDIDO COMO ENVIADO
    const res = await axios.post("/api/data/admin/pedidos/domicilio", {
      id_pedido: id_pedido,
    });
    console.log(" RES ", res);
    if (res.status === 200) {
      toast.success("Envio marcado como enviado");
      router.push("/administrador/Domicilio");
    } else {
      toast.error("Algo salio mal");
    }
  };

  return (
    <>
      <Navbar />
      <main className={style.main}>
        <div className={style.head}>
          <span className={style.regresar} onClick={() => regresar()}>
            <IconRegresar />
          </span>
          <div className={style.btn}>
            {isDomicilio === true ? (
              <button className="btn" onClick={() => enviarPedido()}>
                Enviar Pedido
              </button>
            ) : (
              <button className="btn" onClick={() => pagar()}>
                Marcar como Pagado
              </button>
            )}
          </div>
        </div>
        <span className={style.title}>Detalles del Pedido</span>
        <span className={style.price}>Total del Pedido ${totalPedido}</span>

        <article className={style.article}>
          {detallePedido.length > 0 ? (
            detallePedido.map((producto, index) => (
              <CardDetallePedido key={index} data={producto} />
            ))
          ) : (
            <p>No hay productos en este pedido.</p>
          )}
        </article>

        {isDomicilio === true ? (
          <section className={style.info}>
            <span>Información de Envio</span>
            <div className={style.data}>
              <label htmlFor="cliente">Cliente</label>
              <input
                type="text"
                value={`${cliente?.nombre ?? ""} ${cliente?.apPaterno ?? ""} ${
                  cliente?.apMaterno ?? ""
                }`}
                className="inputG"
                readOnly
              />
              <label htmlFor="correo">Correo</label>
              <input
                type="text"
                value={cliente?.correo ?? ""}
                className="inputG"
                readOnly
              />
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                value={cliente?.direccion ?? ""}
                className="inputG"
                readOnly
              />
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                value={cliente?.telefono ?? ""}
                className="inputG"
                readOnly
              />
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
