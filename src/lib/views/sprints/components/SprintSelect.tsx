import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSprints } from '@/lib/utils/api/hooks/Sprints/useSprints'
import { format } from 'date-fns'
import { SparklesIcon } from 'lucide-react'

type SprintSelectProps = {
  value: string | null
  onChange: (sprintId: string | null) => void
  disabled?: boolean
}

export const SprintSelect: React.FC<SprintSelectProps> = ({ value, onChange, disabled }) => {
  const { sprints } = useSprints()

  const currentSprint = sprints?.find(sprint => sprint.id === value)

  return (
    <Select
      value={value === null ? 'null' : value}
      onValueChange={val => onChange(val === 'null' ? null : val)}
      disabled={disabled}
    >
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='Select sprint...'>
          {currentSprint && (
            <div className='flex items-center gap-2'>
              <SparklesIcon className='h-4 w-4' />
              <span>{currentSprint.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'null'}>No sprint</SelectItem>
        {sprints?.map(sprint => (
          <SelectItem key={sprint.id} value={sprint.id}>
            <div className='flex items-center justify-between gap-4'>
              <span>{sprint.name}</span>
              {sprint.start_date && (
                <span className='text-xs text-muted-foreground'>{format(new Date(sprint.start_date), 'MMM d')}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
