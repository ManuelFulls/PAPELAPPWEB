-- Crear base de datos
CREATE DATABASE IF NOT EXISTS papeleria_app;
USE papeleria_app;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apPaterno VARCHAR(100),
  apMaterno VARCHAR(100),
  telefono VARCHAR(20),
  correo VARCHAR(100) UNIQUE,
  direccion TEXT,
  tipo_usuario ENUM('cliente', 'admin') COMMENT 'Rol del usuario',
  password VARCHAR(255) COMMENT 'Contraseña encriptada'
);

-- Tabla de categorías
CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT
);

-- Tabla de marcas
CREATE TABLE marcas (
  id_marca INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Tabla de productos
CREATE TABLE productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  precio DECIMAL(10,2),
  cantidad INT,
  id_categoria INT,
  modelo VARCHAR(50),
  id_marca INT,
  imagen BLOB,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME,
  estado ENUM('pendiente', 'pagado', 'cancelado'),
  id_usuario INT,
  entrega ENUM('tienda', 'domicilio') COMMENT 'Tipo de entrega',
  direccion_entrega TEXT COMMENT 'Solo se usa si es entrega a domicilio',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de detalle de pedidos
CREATE TABLE detalle_pedidos (
  id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_producto INT,
  cantidad INT,
  total DECIMAL(10,2),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de pagos
CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  metodo_pago ENUM('stripe', 'paypal', 'efectivo', 'otro'),
  estado ENUM('exitoso', 'pendiente', 'fallido'),
  fecha_pago DATETIME,
  referencia_externa VARCHAR(255) COMMENT 'ID de Stripe, etc.',
  monto DECIMAL(10,2),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- Tabla de comprobantes
CREATE TABLE comprobantes (
  id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  tipo ENUM('ticket', 'factura'),
  numero_comprobante VARCHAR(50),
  fecha_emision DATETIME,
  total DECIMAL(10,2),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
  -- archivo_url eliminado como pediste
);

