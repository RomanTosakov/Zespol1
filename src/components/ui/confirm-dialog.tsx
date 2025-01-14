import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button, type ButtonProps } from '@/components/ui/button'
import NiceModal, { useModal } from '@ebay/nice-modal-react'

type ConfirmDialogProps = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: ButtonProps['variant']
  onConfirm?: () => void | Promise<void>
}

export default NiceModal.create<ConfirmDialogProps>(
  ({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default', onConfirm }) => {
    const modal = useModal()

    const handleConfirm = async () => {
      if (onConfirm) {
        await onConfirm()
      }
      modal.remove()
    }

    return (
      <Dialog open={modal.visible} onOpenChange={() => modal.remove()}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => modal.remove()}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)
