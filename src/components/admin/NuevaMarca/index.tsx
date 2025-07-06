import style from "./NuevaMarca.module.css";
import { IconClose } from "@/app/lib/Icon";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const NuevaMarca = ({
  newMarca,
  setNewMarca,
  editMarca,
  marcaSelect,
  setEditMarca,
  reloadTabla,
}: any) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const cerrar = () => {
    reset();
    setNewMarca(false);
    if (editMarca) {
      setEditMarca(false);
    }
  };

  useEffect(() => {
    if (editMarca && marcaSelect) {
      // console.log(" SELECCIIIONADO ", marcaSelect);
      setValue("nombre", marcaSelect.nombre);
    }
  }, [editMarca, marcaSelect, setValue]);

  const onSubmit = async (data: any) => {
    // console.log("Datos del formulario:", data.nombre);

    if (editMarca) {
      const res = await axios.put("/api/data/admin/marcas", {
        data: { id_marca: marcaSelect.id_marca, nombre: data.nombre },
      });

      if (res.status === 200) {
        toast.success("Modificado Correctamente");
        reloadTabla();
        cerrar();
      } else {
        toast.error("Algo salio mal");
      }
    } else {
      const res = await axios.post("/api/data/admin/marcas", {
        nombre: data.nombre,
      });
      if (res.status === 200) {
        reloadTabla();
        cerrar();
      }
      // console.log(" respuesta ", res);
    }
  };

  if (!newMarca) return null;

  return (
    <section className="modal">
      <Toaster position="top-center" reverseOrder={false} />
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
          name="nombre"
        />

        <button type="submit" className="btn2">
          {editMarca ? "Actualizar" : "Guardar"}
        </button>
      </form>
    </section>
  );
};

export default NuevaMarca;
