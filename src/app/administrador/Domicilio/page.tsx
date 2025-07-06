"use client";
import style from "./Domicilio.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/admin/Navbar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Domicilio() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState(""); // 🔍 Estado del input
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/data/admin/pedidos/domicilio");
        setPedidos(res.data.data);
      } catch (error) {
        toast.error("Algo salió mal");
      }
    };

    getData();
  }, [reload]);

  const ver = (id_pedido: any) => {
    router.push(
      `/administrador/DetallePedido/${id_pedido}?admin=true&domicilio=true`
    );
  };

  const cancelar = async (id_pedido: any) => {
    try {
      const res = await axios.post(
        "/api/data/admin/pedidos/domicilio/cancelar",
        {
          id_pedido,
        }
      );

      if (res.status === 200) {
        setReload(!reload);
        toast.success("Producto cancelado correctamente");
      }
    } catch {
      toast.error("Algo salió mal, inténtelo de nuevo");
    }
  };

  // 🔍 Filtrar pedidos
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termino = busqueda.toLowerCase();
    return (
      pedido.nombre_completo?.toLowerCase().includes(termino) ||
      pedido.correo?.toLowerCase().includes(termino) ||
      pedido.numero_comprobante?.toLowerCase().includes(termino)
    );
  });

  return (
    <>
      <Navbar />
      <main className={style.main}>
        <span className={style.title}>PEDIDOS A DOMICILIO </span>
        <div className={style.head}>
          <input
            type="text"
            className="inputG"
            placeholder="Buscar nombre, comprobante o correo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <article className={style.boxT}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>No. Comprobante</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((pedido: any) => (
                  <tr key={pedido.id_pedido}>
                    <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td>{pedido.nombre_completo}</td>
                    <td>{pedido.correo}</td>
                    <td>{pedido.numero_comprobante || "Sin comprobante"}</td>
                    <td>${pedido.total}</td>
                    <td>
                      <div className={style.boxCaja}>
                        <button
                          className="btn"
                          onClick={() => ver(pedido.id_pedido)}
                        >
                          Ver
                        </button>
                        <button
                          className="btnCancelar"
                          onClick={() => cancelar(pedido.id_pedido)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    No hay pedidos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </article>
      </main>
    </>
  );
}
