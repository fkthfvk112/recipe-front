import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodedUserInfo, decodeUserJwt } from './app/(utils)/decodeJwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const refreshCookie = request.cookies.get('mugin-refreshtoken');
  const { pathname, search } = request.nextUrl;


  if(!refreshCookie){
    const signinUrl = new URL('/signin', request.url);

    // 원래 가려던 주소 저장
    signinUrl.searchParams.set(
      'redirect',
      pathname + search
    );

    // 로그인 페이지로 보내진 이유
    signinUrl.searchParams.set('reason', 'auth');

    return NextResponse.redirect(signinUrl);
  }

  if(request.nextUrl.pathname.startsWith("/admin")){
    const jwt:decodedUserInfo|undefined = await decodeUserJwt();
    if(!jwt?.roles?.includes("ROLE_ADMIN")){
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/fridge/:path*',
            '/userfeed/myfeed', '/accountSetting', '/accountMenuList', '/admin/:path*'],
}
