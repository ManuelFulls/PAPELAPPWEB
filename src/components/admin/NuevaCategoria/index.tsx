import { useForm } from "react-hook-form";
import style from "./NuevaCategoria.module.css";
import { IconClose } from "@/app/lib/Icon";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";

const NuevaCategoria = ({
  newCategoria,
  setNewCategoria,
  reloadTabla,
  edit,
  selectCat,
  selectNull,
}: any) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const cerrar = () => {
    reset();
    setNewCategoria(false);
  };

  useEffect(() => {
    if (edit) {
      setValue("nombre", selectCat.nombre);
      setValue("descripcion", selectCat.descripcion);
    }
  }, [setValue, selectCat, edit]);

  const onSubmit = async (data: any) => {
    if (edit) {
      //console.log("MODIFICA ", selectCat);
      const res = await axios.put("/api/data/admin/categorias", {
        id_categoria: selectCat.id_categoria,
        nombre: data.nombre,
        descripcion: data.descripcion,
      });

      if (res.status === 200) {
        toast.success("Modificado Correctamente");
        reloadTabla();
        cerrar();
        selectNull();
      }
      //selectCat
      //selectNull()
    } else {
      const res = await axios.post("/api/data/admin/categorias", {
        nombre: data.nombre,
        descripcion: data.descripcion,
      });

      if (res.status === 200) {
        toast.success("Agregado Correctamente");
        reloadTabla();
        cerrar();
      } else {
        toast.error("Algo salio mal");
        cerrar();
      }
    }
  };

  if (!newCategoria) return null;

  return (
    <section className="modal">
      <form
        className={style.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className={style.close}>
          <span className={style.closet} onClick={cerrar}>
            <IconClose />
          </span>
        </div>

        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          {...register("nombre", { required: true })}
          placeholder="Nombre de la categoría"
        />

        <label htmlFor="descripcion">Descripción</label>
        <input
          type="text"
          {...register("descripcion")}
          placeholder="Descripción (opcional)"
        />

        <button type="submit" className="btn2">
          Guardar
        </button>
      </form>
    </section>
  );
};

export default NuevaCategoria;
