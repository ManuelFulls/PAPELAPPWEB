"use client";
import style from "./registrate.module.css";
import { IconFlecha } from "../lib/Icon";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Registrate() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Datos del formulario:", data);
    try {
      const res = await axios.post("/api/auth", data);
      if (res.status === 200) {
        toast.success("Usuario registrado correctamente");
        reset();
        router.push(res.data.redirectUrl);
      } else {
        toast.error("Error al registrar usuario");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <article className={style.all}>
      <span
        className={style.head}
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
      >
        <IconFlecha /> PAPELAPP
      </span>

      <main>
        <section className={style.section}>
          <span className={style.title}>Crear Cuenta</span>
          <form
            className={style.form}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            id="formRegistro"
          >
            <div className={style.int}>
              <label htmlFor="nombre">
                Nombre <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                })}
              />
              <p className={style.error}>
                {typeof errors.nombre?.message === "string"
                  ? errors.nombre.message
                  : "\u00A0"}
              </p>
            </div>

            <div className={style.int}>
              <label htmlFor="apPaterno">
                Apellido Paterno <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="text"
                id="apPaterno"
                {...register("apPaterno", {
                  required: "El apellido es requerido",
                })}
              />
              <p className={style.error}>
                {typeof errors.apPaterno?.message === "string"
                  ? errors.apPaterno.message
                  : "\u00A0"}
              </p>
            </div>

            <div className={style.int}>
              <label htmlFor="apMaterno">
                Apellido Materno <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="text"
                id="apMaterno"
                {...register("apMaterno", {
                  required: "El apellido es requerido",
                })}
              />
              <p className={style.error}>
                {typeof errors.apMaterno?.message === "string"
                  ? errors.apMaterno.message
                  : "\u00A0"}
              </p>
            </div>

            <div className={style.int}>
              <label htmlFor="correo">
                Correo <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="email"
                id="correo"
                {...register("correo", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Correo inválido",
                  },
                })}
              />
              <p className={style.error}>
                {typeof errors.correo?.message === "string"
                  ? errors.correo.message
                  : "\u00A0"}
              </p>
            </div>

            <div className={style.int}>
              <label htmlFor="password">
                Contraseña <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
              />
              <p className={style.error}>
                {typeof errors.password?.message === "string"
                  ? errors.password.message
                  : "\u00A0"}
              </p>
            </div>
          </form>

          <div className={style.boxCAJA}>
            <button className="btn" type="submit" form="formRegistro">
              Registrarse
            </button>
          </div>

          <section className={style.caja}>
            <span className={style.cuenta}>
              ¿Ya tienes cuenta?{" "}
              <span
                className={style.iniciar}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/IniciarSesion");
                }}
              >
                Iniciar Sesión
              </span>
            </span>
          </section>
        </section>
      </main>
    </article>
  );
}
