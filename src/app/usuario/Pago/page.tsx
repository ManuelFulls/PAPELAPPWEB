"use client";

import style from "./Pago.module.css";
import { useState, useEffect } from "react";
import UseNavbar from "@/components/usuario/UseNavbar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Pago() {
  const router = useRouter();

  const [tipoEntrega, setTipoEntrega] = useState<"tienda" | "domicilio" | "">(
    ""
  );
  const [usuario, setUsuario] = useState<any>(null);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/cookie");
        const data = await axios.get("/api/data/user/cuenta", {
          params: { id_usuario: res.data.data.id_usuario },
        });
        //  console.log("dato cuetaaaaa ", data);
        setUsuario(data.data);

        if (data.data.direccion) {
          setDireccion(data.data.direccion);
        } else {
          const savedDireccion = localStorage.getItem("direccion");
          if (savedDireccion) setDireccion(savedDireccion);
        }

        if (data.data.telefono) {
          setTelefono(data.data.telefono);
        } else {
          const savedTelefono = localStorage.getItem("telefono");
          if (savedTelefono) setTelefono(savedTelefono);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (direccion) localStorage.setItem("direccion", direccion);
  }, [direccion]);

  useEffect(() => {
    if (telefono) localStorage.setItem("telefono", telefono);
  }, [telefono]);

  //************************************************************** */
  const handlePagar = async () => {
    if (loading) return;

    if (tipoEntrega === "") {
      toast.error("Selecciona el tipo de entrega");
      return;
    }
    // console.log(" SELECIONADO ", tipoEntrega);
    if (tipoEntrega === "domicilio") {
      if (direccion.trim() === "") {
        toast.error("Debes ingresar una dirección para envío");
        return;
      }
      if (telefono.trim() === "") {
        toast.error("Debes ingresar un teléfono para envío");
        return;
      }

      //SI ES A DOMICILIO SE REALIZA TODO LO DE LA TARJETA

      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      if (carrito.length === 0) {
        toast.error("Carrito vacío");
        return;
      }

      setLoading(true);

      try {
        // console.log("Enviando carrito:", carrito);

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carrito,
            tipoEntrega,
            direccion: tipoEntrega === "domicilio" ? direccion : null,
            telefono: tipoEntrega === "domicilio" ? telefono : null,
            usuario: usuario?.id_usuario || null,
          }),
        });

        // console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", usuario);

        if (data?.url) {
          // ✅ Guardar todos los datos en localStorage para usarlos después del pago
          localStorage.setItem(
            "pedido_info",
            JSON.stringify({
              id_usuario: usuario.id_usuario,
              tipoEntrega,
              direccion: tipoEntrega === "domicilio" ? direccion : null,
              telefono: tipoEntrega === "domicilio" ? telefono : null,
              carrito,
              tipoComprobante: "ticket", // puedes cambiarlo a 'factura' si se selecciona
            })
          );
          //EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

          // Redirigir directamente a la URL de Stripe
          window.location.href = data.url;

          return;
        } else {
          console.error("No URL in response:", data);
          toast.error("No se pudo obtener la URL de pago");
        }

        //*************************************************************************************/
      } catch (error) {
        console.error("Error completo:", error);
        toast.error("Error al procesar el pago. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    } else if (tipoEntrega === "tienda") {
      //****************************************************************************** */
      //SERA EN TIENDA SOLO SE GUARDARA EN LA BASE DE DATOS LOS DATOS DEL PEDIDO Y SE REDIRIGIRA AL HOME
      // console.log(" TEINDAAA");
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      if (carrito.length === 0) {
        toast.error("Carrito vacío");
        return;
      }

      // Llamada al endpoint para registrar el pedido
      // console.log("usuario ", usuario);
      const res: any = await axios.post("/api/data/user/pedido", {
        id_usuario: usuario.data.id_usuario,
        tipoEntrega,
        direccion,
        telefono,
        carrito,
        referencia_externa: "",
      });
      const { numero_comprobante, id_pedido, montoTotal } = res.data;
      // console.log("RESUL ADO DEEE ", res);
      if (res.status === 200) {
        toast.success("Pedido Solicitado Correctamente");
        localStorage.removeItem("carrito"); // vaciar carrito
        router.push("/usuario/Home"); // opcional: redirigir después

        const pdfRes = await axios.post(
          "/api/data/user/pedido/comprobante/pdf2",
          {
            numero_comprobante,
            tipo: "ticket", // no 'tikect'
            fecha_emision: new Date(),
            total: montoTotal,
            detalles: carrito.map((item: any) => ({
              nombre: item.nombre,
              cantidad: item.cantidad,
              total: (parseFloat(item.precio) * item.cantidad).toFixed(2),
            })),
          },
          {
            responseType: "blob", // 👈 importante para manejar PDF
          }
        );

        // Crear un objeto URL y forzar la descarga
        const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `comprobante_${numero_comprobante}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error("Algo salio mal");
      }
      // console.log(" RESULTADO DEL PEDDIDO ", res);

      //console.log(" DATOS DEL CARRITO ", carrito);
    }
  };

  return (
    <>
      <UseNavbar />
      <main className={style.main}>
        <h2>¿Cómo deseas recibir tu pedido?</h2>
        <div className={style.entrega}>
          <label>
            <input
              type="radio"
              name="entrega"
              value="tienda"
              checked={tipoEntrega === "tienda"}
              onChange={() => setTipoEntrega("tienda")}
            />
            Recoger en tienda
          </label>
          <label>
            <input
              type="radio"
              name="entrega"
              value="domicilio"
              checked={tipoEntrega === "domicilio"}
              onChange={() => setTipoEntrega("domicilio")}
            />
            Envío a domicilio
          </label>
        </div>

        {tipoEntrega === "domicilio" && (
          <section className={style.seccion}>
            <label>Dirección de envío:</label>
            <textarea
              className={style.textarea}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Escribe tu dirección..."
            />
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              placeholder="987654321"
              className={style.inputText}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
            />
          </section>
        )}

        <button
          className={style.btnPagar}
          onClick={handlePagar}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Confirmar"}
        </button>
      </main>
    </>
  );
}
