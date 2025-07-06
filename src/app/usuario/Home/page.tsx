"use client";

import style from "./Home.module.css";
import { useEffect, useState, useRef, Suspense } from "react";
import UseNavbar from "@/components/usuario/UseNavbar";
import toast from "react-hot-toast";
import CardProducto from "@/components/usuario/CardProducto";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function SearchSuccessHandler() {
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "true" && !hasRun.current) {
      hasRun.current = true;

      const pedidoInfo = localStorage.getItem("pedido_info");
      if (!pedidoInfo) return;

      const { tipoEntrega, direccion, telefono, carrito } =
        JSON.parse(pedidoInfo);

      (async () => {
        try {
          const info = await axios.get("/api/cookie");

          const res = await axios.post("/api/data/user/pedido", {
            id_usuario: info.data.data.id_usuario,
            tipoEntrega,
            direccion,
            telefono,
            carrito,
            referencia_externa: "",
            tipoComprobante: "ticket",
          });

          const { numero_comprobante, montoTotal } = res.data;

          const pdfRes = await axios.post(
            "/api/data/user/pedido/comprobante/pdf2",
            {
              numero_comprobante,
              tipo: "ticket",
              fecha_emision: new Date(),
              total: montoTotal,
              detalles: carrito.map((item: any) => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                total: (parseFloat(item.precio) * item.cantidad).toFixed(2),
              })),
            },
            { responseType: "blob" }
          );

          const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `comprobante_${numero_comprobante}.pdf`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();

          toast.success("Pedido confirmado y comprobante generado");
          localStorage.removeItem("carrito");
          localStorage.removeItem("pedido_info");
        } catch (err) {
          console.error("Error al registrar pedido:", err);
          toast.error("Error al confirmar el pedido");
        }
      })();
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const router = useRouter();

  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/data/admin/productos");
      if (res.status === 200) {
        const data = await res.json();
        setProductos(data.data);
      } else {
        toast.error("Algo salio mal");
      }
    };
    getData();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Suspense fallback={null}>
        <SearchSuccessHandler />
      </Suspense>

      <UseNavbar />
      <article>
        <main className={style.main}>
          <section className={style.search}>
            <input
              type="text"
              className="inputG"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </section>

          <section className={style.productos}>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto: any) => (
                <CardProducto key={producto.id_producto} producto={producto} />
              ))
            ) : (
              <p>No hay productos que coincidan con la búsqueda</p>
            )}
          </section>
        </main>
      </article>
    </>
  );
}
