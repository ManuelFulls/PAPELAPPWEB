"use client";

import style from "./Iniciar.module.css";
import { useRouter } from "next/navigation";
import { IconFlecha } from "../lib/Icon";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export default function Iniciar() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // console.log("Datos enviados:", data);

    try {
      const res: any = await axios.post("/api/Login", data);
      console.log("Respuesta del servidor:", res);
      if (res.status === 200) {
        // console.log("Login exitoso:", res.data);
        toast.success("Inicio de sesión exitoso");
        router.push(res.data.redirectUrl);
      }
    } catch (error: any) {
      // console.error("Error en el login:", error);
      toast.error(error.response?.data?.message || "Error desconocido");
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
          <span className={style.title}>Iniciar Sesión</span>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={style.form}
            autoComplete="off"
            id="formLogin"
          >
            <div className={style.int}>
              <label htmlFor="correo">
                Correo <span className={style.obligatorio}>*</span>
              </label>
              <input
                type="email"
                id="correo"
                {...register("correo", {
                  required: "El correo es obligatorio",
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

          <button type="submit" className="btn" form="formLogin">
            Iniciar Sesión
          </button>

          <section className={style.caja}>
            <span className={style.cuenta}>
              ¿No tienes cuenta?{" "}
              <span
                className={style.iniciar}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/registrate");
                }}
              >
                Registrate
              </span>
            </span>
          </section>
        </section>
      </main>
    </article>
  );
}
