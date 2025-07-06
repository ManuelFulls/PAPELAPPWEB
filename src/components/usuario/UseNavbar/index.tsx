"use client";
import style from "./UseNavbar.module.css";
import { IconLibro, IconSalir, IconCar } from "@/app/lib/Icon";
import { useRouter } from "next/navigation";
import axios from "axios";

const UseNavbar = () => {
  const router = useRouter();

  const salir = async () => {
    const res = await axios.post("/api/logout");
    if (res.status === 200) {
      router.push("/");
    }
  };

  return (
    <article className={style.nav}>
      <span className={style.title}>
        PAPELAPP
        <IconLibro />
      </span>
      <div className={style.menu}>
        <ol onClick={() => router.push("/usuario/Home")}>Inicio</ol>
        <ol onClick={() => router.push("/usuario/Pedidos")}>Pedidos</ol>
        <ol onClick={() => router.push("/usuario/Carrito")}>
          <IconCar />
        </ol>
        <ol onClick={() => router.push("/usuario/Cuenta")}>Cuenta</ol>
        <ol className={style.salir} onClick={() => salir()}>
          <IconSalir />
        </ol>
      </div>
    </article>
  );
};

export default UseNavbar;
