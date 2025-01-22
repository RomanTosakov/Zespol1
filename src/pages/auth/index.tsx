import { PublicLayout } from '@/components/layout/PublicLayout'
import { AuthView } from '@/lib/views/Auth/AuthView'

/**
 * @page Authentication
 * @description Authentication page with sign-in and sign-up flows
 * @features
 * - Email verification
 * - User registration
 * - User login
 * - Invitation handling
 * @layout PublicLayout
 * @component AuthView
 */

export default function Page() {
  return <AuthView />
}

Page.getLayout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>
