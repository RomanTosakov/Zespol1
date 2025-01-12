import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { TTask } from '@/lib/types/tasks'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTasks } from '@/lib/utils/api/hooks/Tasks/useTasks'
import { Skeleton } from '@/components/ui/skeleton'

export const EditTaskView = () => {
  const router = useRouter()
  const { taskId } = router.query
  const { tasks, isLoading } = useTasks()
  const task = tasks?.find(t => t.id === taskId)
  const editTask = useEditTask()
  const [formData, setFormData] = useState<TTask | undefined>(task)

  // Update formData when task data is loaded
  useEffect(() => {
    if (task) {
      setFormData(task)
    }
  }, [task])

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-32' />
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <Skeleton className='h-10 w-full' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-20' />
              <Skeleton className='h-10 w-20' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task || !formData) return null

  const handleEditTask = () => {
    editTask.mutate(
      { id: task.id, formData },
      {
        onSuccess: () => {
          router.back()
        }
      }
    )
  }

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Input
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder='Task Title'
          />
          <div className='flex gap-2'>
            <Button onClick={handleEditTask} disabled={editTask.isPending}>
              {editTask.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant='outline' onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}