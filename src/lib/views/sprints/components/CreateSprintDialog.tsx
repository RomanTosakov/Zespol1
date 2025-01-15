import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useAddSprint } from '@/lib/utils/api/hooks/Sprints/useAddSprint'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

export const CreateSprintDialog = NiceModal.create(() => {
  const modal = useModal()
  const { addSprint, isLoading } = useAddSprint()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleSubmit = () => {
    addSprint(
      {
        name,
        description,
        start_date: startDate?.toISOString() || null,
        end_date: endDate?.toISOString() || null,
        is_completed: false
      },
      {
        onSuccess: () => {
          modal.hide()
        }
      }
    )
  }

  return (
    <Dialog open={modal.visible} onOpenChange={() => modal.hide()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Sprint Name</Label>
            <Input id='name' value={name} onChange={e => setName(e.target.value)} placeholder='Enter sprint name' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter sprint description'
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

          <div className='flex justify-end pt-4'>
            <Button onClick={handleSubmit} disabled={!name || isLoading}>
              Create Sprint
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
