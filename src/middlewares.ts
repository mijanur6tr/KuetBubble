import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


 
export const config = {
  matcher: ["/sign-in","/dashboard/path*","/sign-up","/verify/path*"],
}

export async function middleware(request: NextRequest) {

    const token = await getToken({req:request})
    const url = request.nextUrl

    if(token && (
        url.pathname.startsWith("/sing-in") ||
        url.pathname.startsWith("/sing-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/") 
    )){
       return NextResponse.redirect(new URL("/dashboard"))
    }

    if(!token && (url.pathname.startsWith("/dashboard"))){
       return NextResponse.redirect(new URL("/sing-in"))
    }

    return NextResponse.next();

    }
