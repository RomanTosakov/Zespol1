import { NextRequest, userAgent } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const isCurrentPathInPublicUrls = (req: NextRequest) => {
  return req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname.startsWith('/manifest')
}

const isCurrentPathInMixedUrls = (req: NextRequest) => {
  return req.nextUrl.pathname.startsWith('/accept-invite') || req.nextUrl.pathname.startsWith('/logout')
}

export async function middleware(req: NextRequest, res: NextResponse) {
  try {
    const { pathname } = req.nextUrl

    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/manifest') ||
      pathname.startsWith('/logout') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/sw.js')
    ) {
      return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({
      request: req
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request: req
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          }
        }
      }
    )

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const sessionExist = !!user

    if (isCurrentPathInMixedUrls(req)) {
      return NextResponse.next()
    }

    if (!sessionExist && !isCurrentPathInPublicUrls(req)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/logout'

      return NextResponse.redirect(redirectUrl)
    }

    if (sessionExist && isCurrentPathInPublicUrls(req)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/projects'

      return NextResponse.redirect(redirectUrl)
    }

    const url = req.nextUrl
    const { device } = userAgent(req)
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    url.searchParams.set('viewport', viewport)

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)

    return NextResponse.json({ error: 'Middleware error', data: error }, { status: 500 })
  }
}

export const config = {}
