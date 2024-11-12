import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUserProjects } from '@/lib/utils/api/hooks/useGetUserProjects'
import Link from 'next/link'

export const ProjectsList = () => {
  const { data, isLoading } = useGetUserProjects()

  return (
    <div className='mt-4 flex w-full flex-col items-center gap-4'>
      <h1>Projects</h1>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-9 w-[150px]' />
          ))}
        </div>
      ) : data?.length ? (
        <div className='flex w-full flex-col gap-4'>
          {data.map(project => (
            <Link href={`/projects/${project.slug}`} passHref>
              <Button key={project.id} className='flex w-full items-center gap-2'>
                {project.name}
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center font-semibold'>No projects found</div>
      )}
    </div>
  )
}
