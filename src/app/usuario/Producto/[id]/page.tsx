"use client";
import style from "./Producto.module.css";
import UseNavbar from "@/components/usuario/UseNavbar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IconAgregar, IconRegresar } from "@/app/lib/Icon";

export default function Producto() {
  const params = useParams();
  const id_producto = params.id;

  const [producto, setProducto] = useState<any>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(
          `/api/data/user/info?id_producto=${id_producto}`
        );
        setProducto(response.data.data);
      } catch (error) {
        toast.error("Error al obtener producto");
      }
    };

    fetchProducto();
  }, [id_producto]);

  const handleAgregarCarrito = () => {
    if (!producto) return;

    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    const index = carrito.findIndex(
      (item: any) => item.id_producto === producto.id_producto
    );

    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({
        ...producto,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success("Producto agregado al carrito");
  };

  if (!producto) return <p style={{ padding: "2em" }}>Cargando producto...</p>;

  return (
    <>
      <UseNavbar />
      <main className={style.main}>
        <section className={style.card2}>
          <div className={style.card}>
            <div className={style.imgContainer}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className={style.img}
              />
            </div>
            <div className={style.info}>
              <span className={style.name}>{producto.nombre}</span>
              <span>{producto.descripcion}</span>
              <span className={style.stock}>
                Disponible: <span>{producto.cantidad}</span>
              </span>
              <div className={style.precio}>
                <span>${producto.precio}</span>
                <span className={style.icon} onClick={handleAgregarCarrito}>
                  <IconAgregar />
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
