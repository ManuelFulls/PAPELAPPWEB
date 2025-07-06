"use client";
import style from "./Ganancias.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/admin/Navbar";
import toast from "react-hot-toast";

export default function Ganancias() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/data/admin/ganancias");
        if (res.status === 200) {
          setPedidos(res.data.data[0]);
        } else {
          toast.error("Algo salió mal");
        }
      } catch (error) {
        toast.error("Error al cargar datos");
        console.error(error);
      }
    };

    getData();
  }, []);

  // Función para mostrar fecha dd/mm/yyyy
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-MX");
  };

  // AGREGA ESTA NUEVA FUNCIÓN:
  function extraerFechaLocal(fechaIso: string) {
    const fecha = new Date(fechaIso);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const texto = busqueda.toLowerCase();

    const coincideTexto =
      (pedido.nombre_cliente?.toLowerCase() ?? "").includes(texto) ||
      (pedido.entrega?.toLowerCase() ?? "").includes(texto);

    let coincideFecha = true;

    if (fechaSeleccionada && pedido.fecha) {
      const fechaPedido = extraerFechaLocal(pedido.fecha); // 👈 CAMBIAR AQUÍ
      coincideFecha = fechaPedido === fechaSeleccionada;
    }

    return coincideTexto && coincideFecha;
  });

  const totalGanancias = pedidosFiltrados.reduce(
    (acc, pedido) => acc + Number(pedido.monto_total ?? 0),
    0
  );

  return (
    <>
      <Navbar />
      <main className={style.main}>
        <span className={style.title}>GANANCIAS</span>

        <div
          className={style.head}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <input
            type="text"
            className="inputG"
            placeholder="Buscar nombre o tipo entrega"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <input
            type="date"
            className="inputG"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />
          <div className={style.fecha}>
            <button
              type="button"
              className="btn"
              onClick={() => setFechaSeleccionada("")}
              style={{ height: "38px" }}
              title="Limpiar fecha"
            >
              Limpiar fecha
            </button>
          </div>
        </div>

        <div
          className={style.totalGanancias}
          style={{ margin: "1rem 0", fontWeight: "bold" }}
        >
          Total de ganancias: ${totalGanancias.toFixed(2)}
        </div>

        <article className={style.boxT}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Tipo Entrega</th>
                <th>Estado</th>
                <th>Cantidad Productos</th>
                <th>Monto Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No hay resultados
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id_pedido ?? Math.random()}>
                    <td>{pedido.id_pedido}</td>
                    <td>{formatearFecha(pedido.fecha)}</td>
                    <td>{pedido.nombre_cliente}</td>
                    <td>{pedido.entrega}</td>
                    <td>{pedido.estado}</td>
                    <td>{pedido.total_productos ?? 0}</td>
                    <td>${Number(pedido.monto_total ?? 0).toFixed(2)}</td>
                    <td>{/* Aquí botones o acciones si quieres */}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </article>
      </main>
    </>
  );
}
