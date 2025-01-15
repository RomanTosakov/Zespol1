import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Ellipsis,
  LucideArrowLeft,
  LucideDownload,
  LucideExternalLink,
  LucidePaperclip,
  LucideX,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Download from 'yet-another-react-lightbox/plugins/download'
import Captions from 'yet-another-react-lightbox/plugins/captions'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { TTask } from '@/lib/types/tasks'
import { Button } from '@/components/ui/button'
import { useDeleteTaskFile } from '@/lib/utils/api/hooks/Tasks/useDeleteTaskFile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type TProps = {
  task: TTask
}

const getRelativeTimeSinceUpload = (date: string) => {
  dayjs.extend(relativeTime)

  return dayjs(date).fromNow()
}

const getFileExtension = (filename: string) => {
  return filename.split('.').pop() || ''
}

const isAvailableToPreviewImg = (filename: string) => {
  const ext = getFileExtension(filename)

  return ['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')
}

export const TaskFiles: React.FC<TProps> = ({ task }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!task.files?.length) {
    return null
  }

  const filesLinks = task.files
    .map(task => ({
      src: task.download_url || '',
      title: task.file_name,
      description: getRelativeTimeSinceUpload(task.created_at)
    }))
    .filter(v => !!v.src)

  return (
    <div className='flex w-full flex-col gap-4'>
      <Lightbox
        className='z-[9999]'
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={filesLinks}
        plugins={[Thumbnails, Download, Captions]}
      />

      <div className='flex w-full items-center gap-2'>
        <LucidePaperclip className='h-4 w-4' />
        <p className='text-md font-semibold'>Файли</p>
      </div>
      {task.files.length ? (
        <div className='flex w-full flex-col gap-2'>
          {task.files.map(file => (
            <div key={file.id} className='flex items-center justify-between gap-2'>
              <div
                className='flex w-full cursor-pointer items-center gap-2'
                role='button'
                onClick={() => setLightboxOpen(true)}
              >
                <div className='flex h-12 w-16 shrink-0 items-center justify-center rounded-md border bg-muted shadow-sm'>
                  {isAvailableToPreviewImg(file.file_name) ? (
                    <img src={file.overview_url} alt={file.file_name} className='h-12 w-16 object-contain' />
                  ) : (
                    <span className='font-semibold'>{getFileExtension(file.file_name)}</span>
                  )}
                </div>
                <div className='cool-hover w-full rounded-md px-2 py-1'>
                  <p className='mb-1 text-sm font-semibold'>{file.file_name}</p>
                  <p className='text-xs'>{getRelativeTimeSinceUpload(file.created_at)}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <a href={file.overview_url} target='_blank' rel='noreferrer' className='hover:underline'>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <LucideExternalLink className='h-5 w-5' />
                  </Button>
                </a>
                <AttachmentDropdownMenu
                  taskId={task.id}
                  fileId={file.id}
                  downloadLink={file.download_url || file.overview_url}
                  fileName={file.file_name}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const AttachmentDropdownMenu = ({
  taskId,
  fileId,
  downloadLink,
  fileName
}: {
  taskId: string
  fileId: string
  downloadLink: string
  fileName: string
}) => {
  const [isDelete, setIsDelete] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const deleteFile = useDeleteTaskFile()

  const handleDelete = () => {
    deleteFile.mutate(
      {
        taskId: taskId,
        fileId: fileId
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        }
      }
    )
  }

  const handleBackFromDelete = () => {
    setIsDelete(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = (value: boolean) => {
    if (value) {
      setIsDelete(false)
    }

    setIsOpen(value)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Ellipsis className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        {isDelete ? (
          <div className='w-72 p-3'>
            <div className='mb-4 flex items-center justify-between'>
              <Button variant='ghost' className='h-7 w-7 p-1' onClick={handleBackFromDelete}>
                <LucideArrowLeft className='h-5 w-5' />
              </Button>
              <p className='text-md font-semibold'>Delete attachment?</p>
              <Button variant='ghost' className='h-7 w-7 p-1' onClick={handleClose}>
                <LucideX className='h-5 w-5' />
              </Button>
            </div>
            <p className='text-xs'>Deleting an attachment is permanent and there is no way to get it back.</p>
            <Button
              variant={'destructive'}
              size={'sm'}
              onClick={handleDelete}
              className='mt-4 w-full'
              isLoading={deleteFile.isPending}
            >
              Delete attachment
            </Button>
          </div>
        ) : (
          <>
            <DropdownMenuItem className='gap-4' onClick={() => setIsDelete(true)} asChild>
              <a href={downloadLink} target='_blank' rel='noreferrer' download={fileName}>
                <LucideDownload className='h-5 w-5' />
                Download
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-4' onClick={() => setIsDelete(true)} onSelect={e => e.preventDefault()}>
              <Trash2 className='h-5 w-5' />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
