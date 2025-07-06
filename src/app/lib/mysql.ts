import mysql from "mysql2/promise";
import sharp from "sharp";

const config = {
  host: "ballast.proxy.rlwy.net",
  user: "root",
  port: 31229,
  password: "GZsKlcFLXBjaSxCEkhdFjTlcdkQNrEKh",
  database: "railway",
};

const connection = mysql.createPool(config);

export class PapeleriaModel {
  //AÑADIR MARCA
  static async addMarca(nombre: any) {
    try {
      const marca = await connection.query(
        "INSERT INTO marcas (nombre) VALUES (?) ",
        [nombre]
      );

      return true;
    } catch (error) {
      console.log(error);
    }
  }
  // VER TODAS LAS MARCAS
  static async getMarcas() {
    try {
      const marcas = await connection.query("SELECT * FROM marcas  ");

      return marcas;
    } catch (error) {
      console.log(error);
    }
  }

  //ELIMINAR MARCA ID
  static async deleteMarca(id_marca: number) {
    try {
      const result = await connection.query(
        "DELETE FROM marcas WHERE id_marca = ?",
        [id_marca]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //ACTUALIZAR MARCA
  static async updateMarca({ id_marca, nombre }: any) {
    try {
      const result = await connection.query(
        "UPDATE marcas SET nombre = ? WHERE id_marca = ?",
        [nombre, id_marca]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //NUEVA CATEGORIA
  static async newCategoria({ nombre, descripcion }: any) {
    try {
      const marca = await connection.query(
        "INSERT INTO categorias (nombre, descripcion) VALUES (?,?) ",
        [nombre, descripcion]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //VER TODAS LAS CATEGORIAS
  static async getCategorias() {
    try {
      const [categorias] = await connection.query("SELECT * FROM categorias  ");
      return categorias;
    } catch (error) {
      console.log(error);
    }
  }
  //ELIMINAR CATEGORIA

  static async deleteCategoria(id_categoria: number) {
    try {
      const result = await connection.query(
        "DELETE FROM categorias WHERE id_categoria = ?",
        [id_categoria]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  //ACTUALIZAR CATEGORIA
  static async updateCategoria({ id_categoria, nombre, descripcion }: any) {
    try {
      const result = await connection.query(
        "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
        [nombre, descripcion, id_categoria]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //NUEVO PRODUCTO
  static async newProducto({
    nombre,
    descripcion,
    precio,
    cantidad,
    categoria,
    marca,
    imagen,
  }: any) {
    try {
      if (!imagen || !imagen.buffer) {
        throw new Error("La imagen es obligatoria");
      }

      // Convertir la imagen File a buffer y procesar con Sharp
      const resizedImageBuffer = await sharp(imagen.buffer)
        .resize({ width: 500 })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const producto = await connection.query(
        "INSERT INTO productos (nombre, descripcion, precio, cantidad, id_categoria, id_marca, imagen) VALUES  (?, ?, ?, ?, ?, ?, ?) ",
        [
          nombre,
          descripcion,
          precio,
          cantidad,
          categoria,
          marca,
          resizedImageBuffer,
        ]
      );
      return producto;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      return false;
    }
  }

  //VER TODOS LOS PRODUCTOS
  static async getProductos() {
    try {
      const [productos] = await connection.query(
        `
  SELECT 
    p.id_producto,
    p.nombre,
    p.descripcion,
    p.precio,
    p.cantidad,
    p.imagen,
    c.id_categoria,
    c.nombre AS nombreCat,
    m.id_marca,
    m.nombre AS nombreMarc
  FROM productos p
  JOIN categorias c ON p.id_categoria = c.id_categoria
  JOIN marcas m ON p.id_marca = m.id_marca;
`
      );
      return productos as any[];
    } catch (error) {
      console.log(error);
    }
  }

  //ELIMINAR PRODUCTO

  static async deleteProducto(id_producto: number) {
    try {
      const result = await connection.query(
        "DELETE FROM productos WHERE id_producto = ?",
        [id_producto]
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //ACTUALIZAR PRODUCTO

  static async updateProducto({
    id_producto,
    nombre,
    descripcion,
    precio,
    cantidad,
    categoria,
    marca,
    imagen,
  }: any) {
    console.log("DDD");
    try {
      let resultado;

      if (imagen) {
        // Actualizar con nueva imagen
        resultado = await connection.query(
          "UPDATE productos SET nombre=?, descripcion=?, precio=?, cantidad=?, id_categoria=?, id_marca=?, imagen=? WHERE id_producto=?",
          [
            nombre,
            descripcion,
            precio,
            cantidad,
            categoria,
            marca,
            imagen,
            id_producto,
          ]
        );
      } else {
        // Actualizar sin cambiar imagen
        resultado = await connection.query(
          "UPDATE productos SET nombre=?, descripcion=?, precio=?, cantidad=?, id_categoria=?, id_marca=? WHERE id_producto=?",
          [nombre, descripcion, precio, cantidad, categoria, marca, id_producto]
        );
      }

      // Verificar si se actualizó algún registro
      // Esto depende de tu librería de conexión MySQL
      // Para mysql2: resultado.affectedRows
      // Para otras: resultado.changedRows o similar

      return resultado;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return false;
    }
  }

  //AGREGAR NUEVO USUARIO
  static async addUsuario({
    nombre,
    correo,
    hashedPassword,
    apPaterno,
    apMaterno,
  }: any) {
    try {
      const [resul]: any = await connection.query(
        "INSERT INTO usuarios (nombre, apPaterno, apMaterno, correo,tipo_usuario, password) VALUES (?, ?, ?,?,?,?)",
        [nombre, apPaterno, apMaterno, correo, "cliente", hashedPassword]
      );
      console.log(" DATOS DEL ID ", resul.inserId);
      return resul.insertId;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async Login(correo: string) {
    try {
      const [user]: any = await connection.query(
        "SELECT * FROM usuarios WHERE correo =?",
        [correo]
      );
      if (user.length === 0) {
        return null; // Usuario no encontrado
      }
      return user[0]; // Retorna el primer usuario encontrado
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async BuscarProductoID(id_producto: number) {
    try {
      const [producto]: any = await connection.query(
        "SELECT * FROM productos WHERE id_producto =?",
        [id_producto]
      );

      return producto[0]; // Retorna el primer producto encontrado
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //BUSCAR USUARIO POR ID
  static async BuscarUserID(id_usuario: number) {
    try {
      const [usuario]: any = await connection.query(
        "SELECT * FROM usuarios WHERE id_usuario =?",
        [id_usuario]
      );

      return usuario[0]; // Retorna el primer producto encontrado
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //METODOS DE PEDIDO

  static async updateUsuarioDireccionTelefono(
    id_usuario: number,
    direccion: string,
    telefono: string
  ) {
    try {
      await connection.query(
        "UPDATE usuarios SET direccion = ?, telefono = ? WHERE id_usuario = ?",
        [direccion, telefono, id_usuario]
      );
    } catch (error) {
      throw error;
    }
  }

  static async insertPedido(
    fecha: Date,
    estado: string,
    id_usuario: number,
    entrega: string,

    direccion_entrega: string | null
  ) {
    console.log(
      " DATO SBE ",
      fecha,
      estado,
      id_usuario,
      entrega,
      direccion_entrega
    );
    let isEstado = "";

    if (entrega === "domicilio") {
      isEstado = "pagado";
    } else {
      isEstado = "pendiente";
    }
    try {
      const [result] = await connection.query(
        "INSERT INTO pedidos (fecha, estado, id_usuario, entrega, direccion_entrega) VALUES (?, ?, ?, ?, ?)",
        [fecha, isEstado, id_usuario, entrega, direccion_entrega]
      );
      // @ts-ignore
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getPrecioProducto(id_producto: number) {
    try {
      const [rows] = await connection.query(
        "SELECT precio FROM productos WHERE id_producto = ?",
        [id_producto]
      );
      // @ts-ignore
      return rows[0]?.precio || 0;
    } catch (error) {
      throw error;
    }
  }

  static async insertDetallePedido(
    id_pedido: number,
    id_producto: number,
    cantidad: number,
    total: number
  ) {
    try {
      await connection.query(
        "INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, total) VALUES (?, ?, ?, ?)",
        [id_pedido, id_producto, cantidad, total]
      );
    } catch (error) {
      throw error;
    }
  }

  static async insertComprobante({
    id_pedido,
    tipo,
    numero_comprobante,
    fecha_emision,
    total,
  }: any) {
    try {
      await connection.query(
        "INSERT INTO comprobantes (id_pedido, tipo, numero_comprobante, fecha_emision, total) VALUES (?, ?, ?, ?,?)",
        [id_pedido, tipo, numero_comprobante, fecha_emision, total]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async insertPago(
    id_pedido: number,
    metodo_pago: string,
    estado: string,
    fecha_pago: Date,
    referencia_externa: string | null,
    monto: number
  ) {
    try {
      await connection.query(
        "INSERT INTO pagos (id_pedido, metodo_pago, estado, fecha_pago, referencia_externa, monto) VALUES (?, ?, ?, ?, ?, ?)",
        [id_pedido, metodo_pago, estado, fecha_pago, referencia_externa, monto]
      );
    } catch (error) {
      throw error;
    }
  }

  //FUNCIONES PARA EL COMPROBANTE
  static async getPedidoById(id_pedido: number) {
    const [rows] = await connection.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [id_pedido]
    );
    return rows;
  }

  static async getDetallePedido(id_pedido: number) {
    const [rows] = await connection.query(
      `SELECT dp.*, p.nombre FROM detalle_pedidos dp
     JOIN productos p ON dp.id_producto = p.id_producto
     WHERE dp.id_pedido = ?`,
      [id_pedido]
    );
    return rows as any;
  }

  static async getComprobanteByPedido(id_pedido: number) {
    const [rows] = await connection.query(
      "SELECT * FROM comprobantes WHERE id_pedido = ?",
      [id_pedido]
    );
    return rows;
  }

  //DESCONTAR LA CANTIDAD DE PRODUCTOS
  static async descontarStock(id_producto: number, cantidad: number) {
    try {
      await connection.query(
        "UPDATE productos SET cantidad = cantidad - ? WHERE id_producto = ? AND cantidad >= ?",
        [cantidad, id_producto, cantidad]
      );
    } catch (error) {
      throw error;
    }
  }

  //ACTUALIZAR DATOS CUENTA

  static async updateUsuario({
    id_usuario,
    nombre,
    apPaterno,
    apMaterno,
    telefono,
    correo,
    direccion,
  }: any) {
    try {
      await connection.query(
        "UPDATE usuarios SET nombre = ?, apPaterno = ?, apMaterno = ?, telefono = ?, correo = ?, direccion = ? WHERE id_usuario = ?",
        [nombre, apPaterno, apMaterno, telefono, correo, direccion, id_usuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async updateContraseña({ id_usuario, password }: any) {
    //console.log("DATOS DE BD ", id_usuario, password);

    try {
      await connection.query(
        "UPDATE usuarios SET password = ? WHERE id_usuario = ?",
        [password, id_usuario]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  //USUARIO VER LISTA DE PEDIDOS TIENDA
  static async getPedidosTienda(id_usuario: any) {
    try {
      const pedidos = await connection.query(
        "select * from pedidos where id_usuario=? and entrega = ? and estado = ?",
        [id_usuario, "tienda", "pendiente"]
      );
      return pedidos;
    } catch (error) {
      throw error;
    }
  }

  //USUARIO VER LISTA DE PEDIDOS DOMICILIO
  static async getPedidosDomicilio(id_usuario: any) {
    try {
      const pedidos = await connection.query(
        "select * from pedidos where id_usuario=? and entrega = ? and estado = ? ",
        [id_usuario, "domicilio", "pagado"]
      );
      return pedidos;
    } catch (error) {
      throw error;
    }
  }

  //USUARIO VER DETALLE DE PEDIDOS

  static async getDetallePedidos(id_pedido: any) {
    try {
      const [pedidos] = await connection.query(
        `        
      SELECT 
        dp.id_detalle_pedido,
        dp.id_pedido,
        dp.cantidad,
        dp.total,
        p.id_producto,
        p.nombre AS nombre_producto,
        p.descripcion AS descripcion_producto,
        p.precio,
        p.imagen,
        m.nombre AS marca,
        c.nombre AS categoria
      FROM detalle_pedidos dp
      JOIN productos p ON dp.id_producto = p.id_producto
      JOIN marcas m ON p.id_marca = m.id_marca
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE dp.id_pedido = ?;
              `,
        [id_pedido]
      );
      return pedidos as any;
    } catch (error) {
      throw error;
    }
  }

  static async getPedidosAdmin() {
    try {
      const [pedidos] = await connection.query(
        `
              
      SELECT 
        p.id_pedido,
        p.fecha,
        p.estado,
        p.entrega,
        u.nombre,
        u.apPaterno,
        u.apMaterno,
        CONCAT(u.nombre, ' ', u.apPaterno, ' ', u.apMaterno) AS nombre_completo,
        u.correo,
        c.numero_comprobante,
        c.total
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN comprobantes c ON p.id_pedido = c.id_pedido
      WHERE p.entrega = ? AND p.estado = ?

        `,
        ["tienda", "pendiente"]
      );
      return pedidos as any[];
    } catch (error) {
      throw error;
    }
  }

  // Cambiar el estado de un pedido por ID
  static async actualizarEstadoPedido(id_pedido: any, estado: any) {
    // console.log(" DATOP S ", id_pedido);
    try {
      const result = await connection.query(
        "UPDATE pedidos SET estado = ? WHERE id_pedido = ?",
        [estado, id_pedido]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  //VER PEDIDOS ADMIN PERO A DOMICILIO
  static async getPedidosAdminDomicilio() {
    try {
      const [pedidos] = await connection.query(
        ` 
      SELECT 
        p.id_pedido,
        p.fecha,
        p.estado,
        p.entrega,
        u.nombre,
        u.apPaterno,
        u.apMaterno,
        CONCAT(u.nombre, ' ', u.apPaterno, ' ', u.apMaterno) AS nombre_completo,
        u.correo,
        c.numero_comprobante,
        c.total
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN comprobantes c ON p.id_pedido = c.id_pedido
      WHERE p.entrega = ? AND p.estado = ?
        `,
        ["domicilio", "pagado"]
      );
      return pedidos as any[];
    } catch (error) {
      throw error;
    }
  }

  //FUNCIONES PARA DEVOLVER LA CANTIDAD DE UN PEDIDO A DOMICILIO

  static async reponerStock(id_producto: number, cantidad: number) {
    await connection.query(
      "UPDATE productos SET cantidad = cantidad + ? WHERE id_producto = ?",
      [cantidad, id_producto]
    );
  }

  //BUSCAR UN SOLO PEDIDO
  static async getPedidoByID(id_pedido: any) {
    try {
      const res = await connection.query(
        " select * from pedidos where id_pedido = ?",
        [id_pedido]
      );
      return res;
    } catch (error) {}
  }

  //VER GANANCIAS
  static async getGanancias() {
    try {
      const res = connection.query(`
        SELECT 
        p.id_pedido,
        p.fecha,
        CONCAT(u.nombre, ' ', u.apPaterno, ' ', u.apMaterno) AS nombre_cliente,
        p.entrega,
        p.estado,
        SUM(dp.cantidad) AS total_productos,
        SUM(dp.total) AS monto_total
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
      WHERE 
        (p.entrega = 'domicilio' AND p.estado IN ('pagado', 'enviado'))
        OR
        (p.entrega = 'tienda' AND p.estado = 'pagado')
      GROUP BY 
        p.id_pedido, p.fecha, u.nombre, u.apPaterno, u.apMaterno, p.entrega, p.estado
      ORDER BY 
        p.fecha DESC;

        `);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
