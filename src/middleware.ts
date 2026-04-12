import { NextResponse, NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { createServerClient } from '@supabase/ssr'

const locales = ['en', 'zh', 'ja', 'zh-tw']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip verification / static files at the root (e.g. WeChat site verification .txt files)
  if (/^\/[^\/]+\.(txt|xml|html)$/.test(pathname)) {
    return NextResponse.next()
  }

  // Skip locale redirect for non-localized pages (e.g. site-wide admin)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.next()
  }

  // Short links — redirect to localized destination based on browser language
  const shortLinks: Record<string, string> = {
    '/yomiplay': '/yomiplay/community',
    '/y': '/yomiplay/community',
    '/yomiplay/admin': '/yomiplay/admin',
  }
  if (shortLinks[pathname]) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}${shortLinks[pathname]}`, request.url)
    )
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }

  // Refresh Supabase Auth session (keeps cookies alive)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    await supabase.auth.getUser()
  }

  return response
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files like `/assets/`, `/favicon.ico`
  matcher: ['/((?!api|_next/static|_next/image|assets|images|favicon.ico|icon.png|sw.js).*)'],
}
