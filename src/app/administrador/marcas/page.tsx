"use client";

import style from "./marcas.module.css";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/admin/Navbar";
import NuevaMarca from "@/components/admin/NuevaMarca";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);

  const [newMarca, setNewMarca] = useState(false);

  const [editMarca, setEditMarca] = useState(false);

  const [reload, setReload] = useState(false);

  const [marcaSelect, setMarcaSelect] = useState();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/data/admin/marcas");
      if (res.status === 200) {
        setMarcas(res.data.data[0]);
      } else {
        toast.error("Algo Salio Mal");
      }
    };
    getData();
  }, [reload]);

  const nuevaMarca = () => {
    setNewMarca(true);
  };

  const reloadTabla = () => {
    setReload(!reload);
  };

  const eliminarMarca = async (marca: any) => {
    const res = await axios.delete("/api/data/admin/marcas", {
      data: { id_marca: marca.id_marca },
    });
    if (res.status === 200) {
      toast.success("Eliminado Correctamente");
      setReload(!reload);
    } else {
      toast.error("Algo salio mal");
    }
  };

  const modificar = async (marca: any) => {
    setMarcaSelect(marca);
    setEditMarca(true);
    setNewMarca(true);
  };

  return (
    <article>
      <Navbar />
      <main className={style.main}>
        <Toaster position="top-center" reverseOrder={false} />
        <span className={style.title}>Marcas</span>
        <section className={style.buttons}>
          <button className="btn2" onClick={nuevaMarca}>
            Nueva Marca
          </button>
        </section>
        <article className={style.box}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>

                <th className="but"></th>
              </tr>
            </thead>

            <tbody className="tbody">
              {marcas.length > 0 ? (
                marcas.map((marca: any) => (
                  <tr key={marca.id_marca} className="tr">
                    <td>{marca.nombre}</td>
                    <td className="butons">
                      <button
                        className="btn-cancelar2"
                        onClick={() => eliminarMarca(marca)}
                      >
                        Eliminar
                      </button>
                      <button className="btn2" onClick={() => modificar(marca)}>
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="tr">
                  <td colSpan={2}>No hay marcas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>
        <NuevaMarca
          newMarca={newMarca}
          setNewMarca={setNewMarca}
          editMarca={editMarca}
          marcaSelect={marcaSelect}
          setEditMarca={setEditMarca}
          reloadTabla={reloadTabla}
        />
      </main>
    </article>
  );
}
