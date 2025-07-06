"use client";

import style from "./Page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import UseNavbar from "@/components/usuario/UseNavbar";
import { IconEdit, IconClose, EyeClose, EyeOpen } from "@/app/lib/Icon";
import toast from "react-hot-toast";

export default function Cuenta() {
  const [usuario, setUsuario] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [reload, setReload] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
  } = useForm();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("/api/cookie");
      console.log(" DATOS COOLI E", res);
      const data = await axios.get("/api/data/user/cuenta", {
        params: { id_usuario: res.data.data.id_usuario },
      });

      const user = data.data.data;
      setUsuario(user);

      reset({
        nombre: user.nombre,
        apPaterno: user.apPaterno,
        apMaterno: user.apMaterno,
        telefono: user.telefono,
        correo: user.correo,
        direccion: user.direccion,
      });
    };

    getData();
  }, [reset, reload]);

  const onSubmit = async (data: any) => {
    const datosModificados = {
      ...data,
      id_usuario: usuario.id_usuario,
    };

    //console.log("Datos modificados:", datosModificados);
    try {
      const res = await axios.post("/api/data/user/cuenta", datosModificados);

      if (res.status === 200) {
        toast.success("Modificado Correctamente");
        setEdit(false);
      }
    } catch (error) {
      toast.error("Algo salio mal");
      console.error("Error al actualizar datos:", error);
    }

    setEdit(false);
  };

  const editar = () => setEdit(true);

  const onSubmitPassword = async (data: any) => {
    //console.log("Nueva contraseña:", data.nuevaPassword);
    const id_usuario = usuario.id_usuario;
    // console.log("USUARIO ", id_usuario);
    const res = await axios.post(
      `/api/data/user/cuenta/password/${id_usuario}`,
      {
        password: data.nuevaPassword,
      }
    );
    // console.log(" RESPUEATA", res);

    if (res.status === 200) {
      setReload(!reload);
      toast.success("Se modifico la contraseña correctamente");
    } else {
      toast.error("Algo salio mal, intentelo de nuevo");
    }

    setModalOpen(false);
    resetPassword();
    setShowPassword(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetPassword();
    setShowPassword(false);
  };

  const Cancelar = () => {
    setEdit(false);
    setReload(!reload);
  };

  return (
    <>
      <UseNavbar />
      <main className={style.main}>
        <span className={style.title}>Información de la Cuenta</span>

        <section className={style.section}>
          <div className={style.edit}>
            <div className={style.buton}>
              <button className="btn" onClick={() => setModalOpen(true)}>
                Cambiar contraseña
              </button>
            </div>
            <span className={style.line} onClick={editar}>
              <IconEdit />
            </span>
          </div>
          <form
            className={style.form}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <label>Nombre</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("nombre")}
            />

            <label>Apellido Paterno</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("apPaterno")}
            />

            <label>Apellido Materno</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("apMaterno")}
            />

            <label>Teléfono</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("telefono")}
            />

            <label>Correo</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("correo")}
            />

            <label>Dirección</label>
            <input
              type="text"
              className={style.inputG}
              disabled={!edit}
              {...register("direccion")}
            />

            {edit && (
              <div className={style.buton}>
                <button className="btnCancelar" onClick={() => Cancelar()}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  Guardar
                </button>
              </div>
            )}
          </form>
        </section>
      </main>

      {/* Modal de cambio de contraseña */}
      {modalOpen && (
        <div className={style.overlay}>
          <div className={style.modal}>
            <div className={style.headModal}>
              <h3>Cambiar Contraseña</h3>
              <span className={style.closeModal} onClick={() => closeModal()}>
                <IconClose />
              </span>
            </div>
            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className={style.formModal}
              autoComplete="off"
            >
              <label>Nueva Contraseña</label>
              <div className={style.passwordWrapper}>
                <input
                  className={style.inputG}
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("nuevaPassword", { required: true })}
                />
                <span
                  className={style.eyeToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOpen /> : <EyeClose />}
                </span>
              </div>

              <div className={style.contentModal}>
                <button type="submit" className="btn">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
