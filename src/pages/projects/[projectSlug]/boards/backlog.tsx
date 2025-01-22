import { BackLogView } from '@/lib/views/tasks/BackLogView'

/**
 * @page Project Backlog
 * @description Project task backlog management page
 * @features
 * - Task list view
 * - Task creation
 * - Task ordering
 * - Task status management
 * @component BackLogView
 * @param {string} projectSlug - Project identifier from URL
 */

const Page = () => {
  return <BackLogView />
}

export default Page
