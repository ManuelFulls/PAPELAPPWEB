import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function middleware(request: NextRequest) {
  //se extrae el token (values)
  const jwt = request.cookies.get("myTokenName");
  const pathname = request.nextUrl.pathname;
  //console.log("Validating inicioo");

  // Permitir acceso libre a la página de redirección post-pago
  if (pathname === "/usuario/Home") {
    return NextResponse.next();
  }

  //se comprueba que el token no sea undefined
  if (jwt === undefined) {
    //si el token no existe redireccionalo al login
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    //si existe el token entonces
    //valida que sea un token valido

    //key_secret del token
    const secret: any = process.env.SECRET_KEY_JWT;
    const { payload } = await jwtVerify(
      jwt.value,
      new TextEncoder().encode(secret)
    );
    //  console.log(payload);
    //si todo va bien entonces continua a la siguiente pagina
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    //si el token no es valido entonces mandalo al login
    return NextResponse.redirect(new URL("/", request.url));
  }
}

//rutas a proteger
export const config = {
  matcher: ["/usuario/:path*", "/administrador/:path*"],
};
