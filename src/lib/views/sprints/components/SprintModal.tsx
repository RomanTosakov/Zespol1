import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TSprintForm, TSprintWithTasks } from '@/lib/types/sprints'
import { useEditSprint } from '@/lib/utils/api/hooks/Sprints/useEditSprint'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, CheckCircleIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { format } from 'date-fns'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useState } from 'react'

type SprintModalProps = {
  initialSprint: TSprintWithTasks
}

export const SprintModal = NiceModal.create(({ initialSprint }: SprintModalProps) => {
  const modal = useModal()
  const { editSprint, isLoading } = useEditSprint()

  const [name, setName] = useState(initialSprint.name)
  const [description, setDescription] = useState(initialSprint.description || '')
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialSprint.start_date ? new Date(initialSprint.start_date) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialSprint.end_date ? new Date(initialSprint.end_date) : undefined
  )

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleNameBlur = () => {
    if (!initialSprint || name === initialSprint.name) return
    editSprint({
      formData: { ...initialSprint, name },
      id: initialSprint.id
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleDescriptionBlur = () => {
    if (!initialSprint || description === initialSprint.description) return
    editSprint({
      formData: { ...initialSprint, description },
      id: initialSprint.id
    })
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (!initialSprint) return
    editSprint({
      formData: { ...initialSprint, start_date: date ? dayjs(date).format('YYYY-MM-DD') : null },
      id: initialSprint.id
    })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (!initialSprint) return
    editSprint({
      formData: { ...initialSprint, end_date: date ? dayjs(date).format('YYYY-MM-DD') : null },
      id: initialSprint.id
    })
  }

  const handleDelete = () => {
    NiceModal.show(ConfirmDialog, {
      title: 'Delete Sprint',
      description: 'Are you sure you want to delete this sprint? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        // TODO: Implement sprint deletion
        modal.hide()
      }
    })
  }

  const handleComplete = () => {
    NiceModal.show(ConfirmDialog, {
      title: 'Complete Sprint',
      description: 'Are you sure you want to complete this sprint? ',
      confirmText: 'Complete',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: () => {
        editSprint({
          formData: { ...initialSprint, is_completed: true },
          id: initialSprint.id
        })
        modal.hide()
      }
    })
  }

  return (
    <Dialog open={modal.visible} onOpenChange={() => modal.hide()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='flex flex-row items-start justify-between pt-6'>
          <div className='flex flex-row items-center gap-2'>
            <div className='flex-1'>
              <Input
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                className='border-none p-0 text-xl focus:!border focus-visible:ring-1'
                placeholder='Sprint name'
              />
            </div>
            <Button variant='ghost' size='icon' className='h-8 w-8' onClick={handleDelete}>
              <Trash2Icon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
            </Button>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleComplete} className='gap-2'>
              <CheckCircleIcon className='h-4 w-4' />
              Complete Sprint
            </Button>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          <>
            <div className='space-y-2'>
              <h3 className='font-medium'>Description</h3>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                placeholder='Add a description...'
                className='min-h-[100px] resize-none'
              />
            </div>

            <div className='flex gap-8'>
              <div>
                <h3 className='font-medium'>Start Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={startDate} onSelect={handleStartDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <h3 className='font-medium'>End Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {endDate ? format(endDate, 'PPP') : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={endDate} onSelect={handleEndDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>
        </div>
      </DialogContent>
    </Dialog>
  )
})
