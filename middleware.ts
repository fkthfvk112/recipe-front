import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodedUserInfo, decodeUserJwt } from './app/(utils)/decodeJwt';
import { generateSlug } from './app/(utils)/slugUtil';

function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'https://api.mug-in.com/api/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

/**
 * 슬러그 없는 URL(/recipe-detail/:id) 또는 세그먼트 이상 시 HTTP 308.
 * 정본 3세그먼트 URL은 API를 치지 않는다(매 상세 조회 지연/부하 방지).
 * 잘못된 단일 슬러그는 page/generateMetadata의 permanentRedirect가 담당.
 */
async function redirectRecipeDetailIfNeeded(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'recipe-detail' || parts.length < 2) {
    return null;
  }

  const recipeId = parts[1];
  if (!/^\d+$/.test(recipeId)) {
    return null;
  }

  // 이미 /recipe-detail/:id/:slug 형태면 middleware에서 API 호출하지 않음
  if (parts.length === 3) {
    return null;
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}recipe/detail?recipeId=${recipeId}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const recipeName: string | undefined = data?.recipeDTO?.recipeName;
    if (!recipeName) {
      return null;
    }

    const expectedSlug = generateSlug(recipeName);
    const url = request.nextUrl.clone();
    // pathname에는 디코딩된 슬러그를 넣고, URL API가 인코딩하도록 한다 (이중 인코딩 방지)
    url.pathname = `/recipe-detail/${recipeId}/${expectedSlug}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/recipe-detail/')) {
    const seoRedirect = await redirectRecipeDetailIfNeeded(request);
    if (seoRedirect) {
      return seoRedirect;
    }
    return NextResponse.next();
  }

  const refreshCookie = request.cookies.get('mugin-refreshtoken');

  if (!refreshCookie) {
    const signinUrl = new URL('/signin', request.url);

    signinUrl.searchParams.set(
      'redirect',
      pathname + search
    );

    signinUrl.searchParams.set('reason', 'auth');

    return NextResponse.redirect(signinUrl);
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const jwt: decodedUserInfo | undefined = await decodeUserJwt();
    if (!jwt?.roles?.includes('ROLE_ADMIN')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/fridge/:path*',
    '/userfeed/myfeed',
    '/accountSetting',
    '/accountMenuList',
    '/admin/:path*',
    '/recipe-detail/:path*',
  ],
}
