import { PrivateLayout } from '@/components/layout/PrivateLayout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import '@/styles/globals.css'
import NiceModal from '@ebay/nice-modal-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserSupabase } from '@utils/supabase/createBrowserSupabase'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { AppInitialProps, AppProps } from 'next/app'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const supabase = createBrowserSupabase()
  const getLayout =
    //@ts-ignore
    Component.getLayout ?? (page => <PrivateLayout>{page}</PrivateLayout>)

  console.log(pageProps)

  return (
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        <ThemeProvider defaultTheme='dark' attribute='class' forcedTheme='dark' disableTransitionOnChange>
          <main
            className={`${GeistSans.variable} ${GeistMono.variable} h-dvh w-full overflow-hidden ${GeistSans.className}`}
          >
            {getLayout(<Component {...pageProps} />)}
          </main>
        </ThemeProvider>
      </NiceModal.Provider>
    </QueryClientProvider>
  )
}
