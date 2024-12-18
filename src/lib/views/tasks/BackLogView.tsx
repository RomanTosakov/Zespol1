import { useTasks } from '@/lib/utils/api/hooks/Tasks/useTasks'
import { CreateTask } from './components/CreateTask'
import { TaskRow } from './components/TaskRow'
import { Skeleton } from '@/components/ui/skeleton'

export const BackLogView: React.FC = () => {
  const { tasks, isLoading } = useTasks()

  return (
    <div className='flex w-full flex-col p-16'>
      <div className='mb-2 flex w-full items-center justify-between font-normal text-foreground'>
        <p>{`Backlog (${tasks?.length ?? '0'} items)`}</p>
      </div>
      <div className='h-fit w-full cursor-pointer border bg-secondary-dimmed [&>*:not(:first-child)]:border-t'>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-11 w-full rounded-none' />
            ))}
          </>
        ) : (
          <>
            <>{tasks?.map(task => <TaskRow task={task} key={task.id} />)}</>
          </>
        )}
      </div>
      <CreateTask />
    </div>
  )
}
