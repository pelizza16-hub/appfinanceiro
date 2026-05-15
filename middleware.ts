import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const protectedRoutes = ["/dashboard", "/transactions"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options as any);
          });
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    if (!user && protectedRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    // Em caso de erro (rede, env inválida), permite o request prosseguir
    // O layout autenticado fará o redirect se necessário
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
