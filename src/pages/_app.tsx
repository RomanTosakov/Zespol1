import { PublicLayout } from '@/components/layout/PublicLayout'
import { createBrowserSupabase } from '@utils/supabase/createBrowserSupabase'
import '@/styles/globals.css'
import NiceModal from '@ebay/nice-modal-react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/components/ThemeProvider'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export default function App({ Component, pageProps }: AppProps) {
  const supabase = createBrowserSupabase()

  return (
    <NiceModal.Provider>
      <ThemeProvider defaultTheme='dark' attribute='class' forcedTheme='dark' disableTransitionOnChange>
        <main className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}>
          <PublicLayout>
            <Component {...pageProps} />
          </PublicLayout>
        </main>
      </ThemeProvider>
    </NiceModal.Provider>
  )
}
