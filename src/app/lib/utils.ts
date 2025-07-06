export function generarNumeroComprobante(): string {
  const now = new Date();
  return `CMB-${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
}
