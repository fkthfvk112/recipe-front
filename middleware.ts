import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('authorization');
  const refreshCookie = request.cookies.get('refresh-token');
  
  if(authCookie === undefined || refreshCookie === undefined || !authCookie.value.startsWith("Bearer_")){

    return NextResponse.redirect(new URL('/signin', request.url))
  }


  const response = NextResponse.next();

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/diet/mydiet/create', '/diet/mydiet/edit/:path*', '/create-recipe', '/board/create/:path*',
            '/userfeed/myfeed', '/accountSetting', '/accountMenuList', '/board/:id*/create'],
}