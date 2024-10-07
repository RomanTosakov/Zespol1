import { createBrowserSupabase } from '@/lib/utils/supabase/createBrowserSupabase'
import '@/styles/globals.css'
import NiceModal from '@ebay/nice-modal-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const supabase = createBrowserSupabase()

  return (
    <NiceModal.Provider>
      <Component {...pageProps} />
    </NiceModal.Provider>
  )
}
