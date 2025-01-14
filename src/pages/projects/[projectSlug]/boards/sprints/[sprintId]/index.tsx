import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useEditSprint } from '@/lib/utils/api/hooks/Sprints/useEditSprint'
import { useSprint } from '@/lib/utils/api/hooks/Sprints/useSprint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function SprintDetailsPage() {
  const router = useRouter()
  const { sprintId } = router.query as { sprintId: string }
  const projectId = useGetProjectId()

  const { sprint, isLoading } = useSprint(sprintId)
  const { editSprint, isLoading: isEditing } = useEditSprint()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  useEffect(() => {
    if (sprint) {
      setName(sprint.name)
      setDescription(sprint.description || '')
      setStartDate(sprint.start_date ? new Date(sprint.start_date) : undefined)
      setEndDate(sprint.end_date ? new Date(sprint.end_date) : undefined)
    }
  }, [sprint])

  const handleSave = () => {
    editSprint({
      formData: {
        name,
        description,
        start_date: startDate?.toISOString() || null,
        end_date: endDate?.toISOString() || null
      },
      id: sprintId
    })
  }

  if (!projectId) return null

  return (
    <div className='space-y-8 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Sprint Details</h1>
        <Button onClick={handleSave} disabled={isEditing || !name}>
          Save Changes
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='h-32 w-full' />
          <div className='flex gap-4'>
            <Skeleton className='h-10 w-1/2' />
            <Skeleton className='h-10 w-1/2' />
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Sprint Name</Label>
            <Input id='name' value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='min-h-[100px]'
            />
          </div>

          <div className='flex gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className='flex-1 space-y-2'>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={date => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>Tasks</h2>
              <Button variant='outline'>Add Task</Button>
            </div>

            {sprint?.tasks?.length === 0 ? (
              <div className='flex h-32 items-center justify-center rounded-md border border-dashed'>
                <div className='text-center'>
                  <h3 className='text-lg font-medium'>No tasks in this sprint</h3>
                  <p className='text-sm text-muted-foreground'>Add tasks to get started</p>
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                {sprint?.tasks?.map(task => (
                  <div key={task.id} className='flex items-center justify-between rounded-md bg-secondary-dimmed p-4'>
                    <span>{task.title}</span>
                    <span className='text-sm text-muted-foreground'>{task.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
