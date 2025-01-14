import { Button } from '@/components/ui/button'
import { FileUploader } from '@/components/ui/file-uploader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TTask } from '@/lib/types/tasks'
import { useUploadTaskFile } from '@/lib/utils/api/hooks/Tasks/useUploadTaskFile'
import { LucideCheckSquare, LucidePaperclip, LucideTags } from 'lucide-react'
import React, { useState } from 'react'

type TProps = {
  task: TTask
}

export const TaskFilesButton: React.FC<TProps> = ({ task }) => {
  const [isAdding, setIsAdding] = useState(false)

  const uploadFile = useUploadTaskFile()
  const [inputKey, setInputKey] = useState(0)
  const [files, setFiles] = React.useState<File[]>([])

  const handleUpload = () => {
    const file = files?.[0]

    if (!file) {
      return
    }

    uploadFile.mutate(
      {
        taskId: task.id,
        file
      },
      {
        onSuccess: () => {
          setInputKey(inputKey + 1)
          setIsAdding(false)
          setFiles([])
        }
      }
    )

    setInputKey(inputKey + 1)
  }

  return (
    <Popover open={isAdding} onOpenChange={setIsAdding}>
      <PopoverTrigger asChild>
        <Button disabled={uploadFile.isPending} className='ml-4 w-fit justify-start'>
          <LucidePaperclip className='mr-1 h-4 w-4' />
          <span className='truncate'>Files</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start'>
        <div className='flex flex-col gap-2'>
          <p className='mb-1 text-sm font-semibold'>Upload attachment</p>

          <FileUploader maxFileCount={1} maxSize={8 * 1024 * 1024} onValueChange={setFiles} />

          <div className='mt-4 flex items-center gap-2'>
            <Button isLoading={uploadFile.isPending} onClick={handleUpload} size={'sm'}>
              Add
            </Button>
            <Button variant={'ghost'} onClick={() => setIsAdding(false)} size={'sm'}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
