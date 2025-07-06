import style from "./Navbar.module.css";
import { useRouter } from "next/navigation";
import { IconLibro } from "@/app/lib/Icon";
import axios from "axios";

const Navbar = () => {
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
        <IconLibro />
        PAPELAPP
      </span>
      <ol onClick={() => router.push("/administrador/productos")}>Productos</ol>
      <ol onClick={() => router.push("/administrador/categorias")}>
        Categorias
      </ol>
      <ol onClick={() => router.push("/administrador/marcas")}>Marcas</ol>
      <ol className={style.dropdown}>
        Ventas
        <div className={style.menu}>
          <li onClick={() => router.push("/administrador/Tienda")}>
            Pedidos tienda
          </li>
          <li onClick={() => router.push("/administrador/Domicilio")}>
            Pedidos domicilio
          </li>
          <li onClick={() => router.push("/administrador/Ganancias")}>
            Historial
          </li>
        </div>
      </ol>

      <ol onClick={() => router.push("/administrador/Ajuste")}>Ajuste</ol>
      <ol onClick={() => salir()}>Salir</ol>
    </article>
  );
};

export default Navbar;
