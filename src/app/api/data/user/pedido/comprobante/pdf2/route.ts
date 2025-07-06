import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  const { numero_comprobante, tipo, fecha_emision, total, detalles } =
    await req.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 tamaño en puntos

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  let y = height - 50;

  page.drawText("Comprobante de Compra", {
    x: 50,
    y,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  y -= 40;
  page.drawText(`Comprobante: ${numero_comprobante}`, {
    x: 50,
    y,
    size: 12,
    font: timesRomanFont,
  });
  y -= 20;
  page.drawText(`Tipo: ${tipo}`, { x: 50, y, size: 12, font: timesRomanFont });
  y -= 20;
  page.drawText(`Fecha: ${new Date(fecha_emision).toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font: timesRomanFont,
  });
  y -= 20;
  page.drawText(`Total: $${parseFloat(total).toFixed(2)}`, {
    x: 50,
    y,
    size: 12,
    font: timesRomanFont,
  });

  y -= 40;
  page.drawText("Detalles del Pedido:", {
    x: 50,
    y,
    size: 14,
    font: timesRomanFont,
  });

  y -= 20;
  detalles.forEach((item: any, index: number) => {
    const texto = `${index + 1}. ${item.nombre} - Cantidad: ${
      item.cantidad
    } - Total: $${item.total}`;
    page.drawText(texto, { x: 50, y, size: 12, font: timesRomanFont });
    y -= 20;
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="comprobante_${numero_comprobante}.pdf"`,
    },
  });
}
