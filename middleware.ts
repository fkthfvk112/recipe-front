import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodedUserInfo, decodeUserJwt } from './app/(utils)/decodeJwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('authorization');
  const refreshCookie = request.cookies.get('refresh-token');
  
  if(authCookie === undefined || refreshCookie === undefined || !authCookie.value.startsWith("Bearer_")){
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if(request.nextUrl.pathname.startsWith("/admin")){
    const jwt:decodedUserInfo|undefined = await decodeUserJwt();
    if(!jwt?.roles?.includes("ROLE_ADMIN")){
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const response = NextResponse.next();

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/diet/mydiet/create', '/diet/mydiet/edit/:path*', '/create-recipe', '/board/create/:path*',
            '/userfeed/myfeed', '/accountSetting', '/accountMenuList', '/board/:id*/create', '/admin/:path*'],
}