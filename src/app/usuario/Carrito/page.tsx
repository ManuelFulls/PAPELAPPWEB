"use client";

import style from "./Carrito.module.css";
import { useState, useEffect } from "react";
import UseNavbar from "@/components/usuario/UseNavbar";
import { IconAgregar } from "@/app/lib/Icon";
import ModalOrdenar from "@/components/usuario/ModalOrdenar";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const router = useRouter();

  const [carrito, setCarrito] = useState<any[]>([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const carritoLocal = localStorage.getItem("carrito");
    if (carritoLocal) {
      setCarrito(JSON.parse(carritoLocal));
    }
  }, []);

  const actualizarLocalStorage = (nuevoCarrito: any[]) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const handleAgregarCantidad = (id_producto: number) => {
    const nuevoCarrito = carrito.map((item) =>
      item.id_producto === id_producto
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );
    actualizarLocalStorage(nuevoCarrito);
  };

  const handleReducirCantidad = (id_producto: number) => {
    let nuevoCarrito = carrito
      .map((item) =>
        item.id_producto === id_producto
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      // Filtrar productos con cantidad <= 0 para eliminarlos
      .filter((item) => item.cantidad > 0);
    actualizarLocalStorage(nuevoCarrito);
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };

  const confirmarCompra = () => {
    setMostrarModal(false);
    router.push("/usuario/Pago"); // página para elegir tipo de envío
  };

  const cancelarCompra = () => {
    setMostrarModal(false);
  };

  return (
    <>
      <UseNavbar />
      <main className={style.main}>
        <h1>Carrito de compras</h1>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            {carrito.map((producto) => (
              <article key={producto.id_producto} className={style.card2}>
                <section className={style.card}>
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
                      Cantidad: <span>{producto.cantidad}</span>
                    </span>
                    <div className={style.precio}>
                      <span>${producto.precio}</span>
                      <div className={style.iconGroup}>
                        <button
                          className={style.iconButton}
                          onClick={() =>
                            handleReducirCantidad(producto.id_producto)
                          }
                        >
                          -
                        </button>
                        <button
                          className={style.iconButton}
                          onClick={() =>
                            handleAgregarCantidad(producto.id_producto)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </article>
            ))}
            <div className={style.totalContainer}>
              <span>Total: </span>
              <span className={style.totalAmount}>
                ${calcularTotal().toFixed(2)}
              </span>
            </div>

            <div className={style.button}>
              <button className="btn" onClick={() => setMostrarModal(true)}>
                Ordenar
              </button>
            </div>
          </>
        )}
        <ModalOrdenar
          isOpen={mostrarModal}
          title="¿Confirmar compra?"
          total={calcularTotal()}
          onClose={cancelarCompra}
          onConfirm={confirmarCompra}
        />
      </main>
    </>
  );
}
