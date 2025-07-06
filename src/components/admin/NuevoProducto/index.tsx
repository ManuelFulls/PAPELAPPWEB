import style from "./NuevoProducto.module.css";
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IconClose } from "@/app/lib/Icon";

const NuevoProducto = ({
  closeModal,
  newProducto,
  reload,
  editProducto,
  setEditProducto,
  selectProducto,
}: any) => {
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/data/admin/categorias");
      if (res.status === 200) {
        setCategorias(res.data.data);
      }

      const resMarcas = await axios.get("/api/data/admin/marcas");
      if (resMarcas.status === 200) {
        // console.log("Marcas obtenidas:", resMarcas.data.data);
        setMarcas(resMarcas.data.data[0]);
      }
    };

    getData();
  }, []);
  useEffect(() => {
    if (editProducto) {
      const { nombre, descripcion, precio, cantidad, id_categoria, id_marca } =
        selectProducto;
      setValue("imagen", null); // Limpiar el campo de imagen
      setValue("nombre", nombre);
      setValue("descripcion", descripcion);
      setValue("precio", precio);
      setValue("cantidad", cantidad);
      setValue("categoria", id_categoria);
      setValue("marca", id_marca);
    }
  }, [editProducto]);

  //ddddd

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    // console.log("Datos del sdnsjndijdnjiformulari<o:");
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("precio", data.precio);
    formData.append("cantidad", data.cantidad);
    formData.append("categoria", data.categoria);
    formData.append("marca", data.marca);

    // Si estamos editando, agregamos el ID del producto
    if (editProducto && selectProducto) {
      formData.append("id_producto", selectProducto.id_producto.toString());
    }

    // Solo agregar imagen si se seleccionó una nueva
    if (data.imagen && data.imagen.length > 0) {
      formData.append("imagen", data.imagen[0]);
    }

    let res;
    if (editProducto) {
      //.log("Editando producto:");
      res = await axios.put("/api/data/admin/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("Editando producto:", res.data);
    } else {
      res = await axios.post("/api/data/admin/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    if (res.status === 200) {
      toast.success(
        editProducto
          ? "Producto modificado correctamente"
          : "Producto creado correctamente"
      );
      reset();
      closeModal();
      reload();
      if (editProducto) {
        setEditProducto(false);
      }
    }
  };

  //dddd
  const cerrar = () => {
    reset();
    closeModal();

    if (editProducto) {
      setEditProducto(false);
    }
  };

  if (!newProducto) return null;

  return (
    <article className="modal">
      <form
        className={style.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <span className={style.close} onClick={cerrar}>
          <IconClose />
        </span>
        <label htmlFor="nombre">Nombre</label>
        <input type="text" {...register("nombre", { required: true })} />

        <label htmlFor="descripcion">Descripción</label>
        <input type="text" {...register("descripcion", { required: true })} />

        <label htmlFor="precio">Precio</label>
        <input type="number" {...register("precio", { required: true })} />

        <label htmlFor="cantidad">Cantidad</label>
        <input type="number" {...register("cantidad", { required: true })} />

        <label htmlFor="categoria">Categoría</label>
        <select
          {...register("categoria", { required: true })}
          className={style.select}
        >
          <option value="">Seleccionar Categoría</option>
          {categorias.map((cat: any) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="marca">Marca</label>
        <select
          {...register("marca", { required: true })}
          className={style.select}
        >
          <option value="">Seleccionar Marca</option>
          {marcas.map((marca: any) => (
            <option key={marca.id_marca} value={marca.id_marca}>
              {marca.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="imagen">Imagen</label>
        <input
          type="file"
          accept="image/*"
          {...register("imagen", { required: !editProducto })}
        />

        <div className={style.buttons}>
          <button className="btn" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </article>
  );
};

export default NuevoProducto;
