"use client";

import style from "./CardProducto.module.css";
import { IconAgregar } from "@/app/lib/Icon";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CardProducto = ({ producto }: any) => {
  const router = useRouter();

  const handleAgregarCarrito = () => {
    // Obtener el carrito actual
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    // Buscar si ya existe el producto
    const index = carrito.findIndex(
      (item: any) => item.id_producto === producto.id_producto
    );

    if (index !== -1) {
      // Ya existe, aumentar cantidad
      carrito[index].cantidad += 1;
    } else {
      // No existe, agregar como nuevo
      carrito.push({
        ...producto,
        cantidad: 1,
      });
    }
    toast.success("Producto agregado al carrito");

    // Guardar actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    //  console.log("Producto agregado al carrito:", producto.nombre);
  };

  const select = () => {
    const id_producto = producto.id_producto;
    router.push(`/usuario/Producto/${id_producto}`);
  };

  const handleAgregarCarritoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // <-- Evita que el click se propague al padre y dispare select()
    handleAgregarCarrito();
  };

  return (
    <article className={style.card2} onClick={select}>
      <section className={style.card}>
        <div className={style.imgContainer}>
          <img src={producto.imagen} alt="Producto" className={style.img} />
        </div>
        <div className={style.info}>
          <span className={style.name}>{producto.nombre}</span>
          <span>{producto.descripcion}</span>
          <span className={style.stock}>
            Disponible: <span>{producto.cantidad}</span>
          </span>
          <div className={style.precio}>
            <span>${producto.precio}</span>
            <span className={style.icon} onClick={handleAgregarCarritoClick}>
              <IconAgregar />
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default CardProducto;
