import { PublicLayout } from '@/components/layout/PublicLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/styles/globals.css'
import NiceModal from '@ebay/nice-modal-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserSupabase } from '@utils/supabase/createBrowserSupabase'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const supabase = createBrowserSupabase()

  return (
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        <ThemeProvider defaultTheme='dark' attribute='class' forcedTheme='dark' disableTransitionOnChange>
          <main className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}>
            <PublicLayout>
              <Component {...pageProps} />
            </PublicLayout>
          </main>
        </ThemeProvider>
      </NiceModal.Provider>
    </QueryClientProvider>
  )
}
