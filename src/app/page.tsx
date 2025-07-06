"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>PAPELAPP</h1>
        <section className={styles.caja}>
          <form action="" className={styles.form}>
            <span className={styles.text}>
              Ven y compra los mejores productos
            </span>

            <button
              className={styles.btn}
              onClick={(e) => {
                e.preventDefault();
                router.push("/registrate");
              }}
            >
              Registrarse
            </button>
            <button
              className={styles.btn}
              onClick={(e) => {
                e.preventDefault();
                router.push("/IniciarSesion");
              }}
            >
              Iniciar Sesión
            </button>
          </form>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>Política de privacidad</span>
        <span>Términos y Condiciones</span>
      </footer>
    </div>
  );
}
