"use client";

import style from "./productos.module.css";
import { useState, useEffect } from "react";
import Navbar from "@/components/admin/Navbar";
import NuevoProducto from "@/components/admin/NuevoProducto";
import { get } from "http";
import axios from "axios";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const [newProducto, setNewProducto] = useState(false);

  const [reloadTabla, setReloadTabla] = useState(false);

  const [editProducto, setEditProducto] = useState(false);

  const [selectProducto, setSelectProducto] = useState();

  const [searchTerm, setSearchTerm] = useState("");

  const reload = () => {
    setReloadTabla(!reloadTabla);
  };

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/data/admin/productos");
      if (res.status === 200) {
        const data = await res.json();
        // console.log("Productos obtenidos:", data.data);
        setProductos(data.data);
      } else {
        console.error("Error al obtener productos");
      }
    };
    getData();
  }, [reloadTabla]);

  // Filtrar productos según searchTerm
  const productosFiltrados = productos.filter((producto: any) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para actualizar searchTerm desde input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const closeModal = () => {
    setNewProducto(false);
  };

  const edit = (producto: any) => {
    // console.log("Editar", producto);
    setSelectProducto(producto);
    setEditProducto(true);
    setNewProducto(true);
  };

  const delet = async (producto: any) => {
    //console.log("Editar", producto);

    const res = await axios.delete("/api/data/admin/productos", {
      data: { id_producto: producto.id_producto },
    });
    if (res.status === 200) {
      toast.success("Producto eliminado correctamente");
      reload();
    }
  };

  return (
    <article className={style.article}>
      <Navbar />

      <h1 className={style.title}>Productos</h1>

      <main className={style.main}>
        <section className={style.buscar}>
          <input
            type="text"
            className="inputG"
            placeholder="🔍Buscar productos por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn2" onClick={() => setNewProducto(true)}>
            Nuevo Producto
          </button>
        </section>
        <article className={style.boxT}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Categoria</th>
                <th>Marca</th>
                <th>Imagen</th>
                <th className="but"></th>
              </tr>
            </thead>

            <tbody className="tbody">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto: any) => (
                  <tr key={producto.id_producto} className="tr">
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.nombreCat}</td>
                    <td>{producto.nombreMarc}</td>
                    <td>
                      {producto.imagen && (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          width="50"
                          height="50"
                        />
                      )}
                    </td>
                    <td className="butons">
                      <button
                        className="btn-cancelar2"
                        onClick={() => delet(producto)}
                      >
                        Eliminar
                      </button>
                      <button className="btn2" onClick={() => edit(producto)}>
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="tr">
                  <td colSpan={8}>No hay productos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>
      </main>
      <NuevoProducto
        newProducto={newProducto}
        closeModal={closeModal}
        reload={reload}
        editProducto={editProducto}
        setEditProducto={setEditProducto}
        selectProducto={selectProducto}
      />
    </article>
  );
}
