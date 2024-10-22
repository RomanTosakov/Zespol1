import { PublicLayout } from '@/components/layout/PublicLayout'
import { AuthView } from '@/lib/views/Auth/AuthView'

export default function Page() {
  return <AuthView />
}

Page.getLayout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>
