import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  //
  const res = await PapeleriaModel.getGanancias();

  if (res) {
    return NextResponse.json(
      { message: "Ganancias  obtenidas correctamente", data: res },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        error: "Ocurrio un error",
      },
      {
        status: 401,
      }
    );
  }
}
