"use client";

import Navbar from "@/components/admin/Navbar";
import style from "./categorias.module.css";
import { useState, useEffect, use } from "react";
import NuevaCategoria from "@/components/admin/NuevaCategoria";
import axios from "axios";
import toast from "react-hot-toast";

export default function Categorias() {
  const marca: any = [];

  const [categorias, setCategorias] = useState([]);

  const [reload, setReload] = useState(false);

  const [newCategoria, setNewCategoria] = useState(false);

  const [edit, setEdit] = useState(false);

  const [selectCat, setSelectCat] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/data/admin/categorias");
      if (res.status === 200) {
        setCategorias(res.data.data);
      } else {
        toast.error("Ocurrio un error al buscar las categorias");
      }
    };

    getData();
  }, [reload]);

  const reloadTabla = () => {
    setReload(!reload);
  };

  const eliminar = async (cat: any) => {
    const res = await axios.delete("/api/data/admin/categorias", {
      data: { id_categoria: cat.id_categoria },
    });
    if (res.status === 200) {
      toast.success("Eliminado correctamente");
      setReload(!reload);
    }
  };

  const selectNull = () => {
    setSelectCat("");
  };

  const modificar = (cat: any) => {
    setEdit(true);
    setSelectCat(cat);
    setNewCategoria(true);
    console.log("Modificar");
  };

  return (
    <article>
      <Navbar />
      <main className={style.main}>
        <span className={style.title}>Categorias</span>
        <section
          className={style.buttons}
          onClick={() => setNewCategoria(true)}
        >
          <button className="btn2">Nueva Categoria</button>
        </section>
        <article className={style.box}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="but"></th>
              </tr>
            </thead>

            <tbody className="tbody">
              {categorias.length > 0 ? (
                categorias.map((cat: any) => (
                  <tr key={cat.id_categoria} className="tr">
                    <td>{cat.nombre}</td>
                    <td>{cat.descripcion || "Sin descripción"}</td>
                    <td className="butons">
                      <button
                        className="btn-cancelar2"
                        onClick={() => eliminar(cat)}
                      >
                        Eliminar
                      </button>
                      <button className="btn2" onClick={() => modificar(cat)}>
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="tr">
                  <td colSpan={3}>No hay categorías registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>
        <NuevaCategoria
          newCategoria={newCategoria}
          setNewCategoria={setNewCategoria}
          reloadTabla={reloadTabla}
          edit={edit}
          selectCat={selectCat}
          selectNull={selectNull}
        />
      </main>
    </article>
  );
}
