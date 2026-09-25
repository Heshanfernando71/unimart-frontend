import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material'
import { useRef, useState } from 'react'
import { getApiError } from '../../../utils/apiError'
import { useArchiveListingMutation } from '../listingsApi'

interface ArchiveListingButtonProps {
  listingId: number
  listingTitle: string
  onArchived?: () => void
}

export const ArchiveListingButton = ({ listingId, listingTitle, onArchived }: ArchiveListingButtonProps) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [severity, setSeverity] = useState<'success' | 'error'>('success')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [archiveListing, { isLoading }] = useArchiveListingMutation()

  const close = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const archive = async () => {
    try {
      await archiveListing(listingId).unwrap()
      setSeverity('success')
      setMessage('Listing archived successfully.')
      close()
      onArchived?.()
    } catch (error) {
      setSeverity('error')
      setMessage(getApiError(error).message)
    }
  }

  return (
    <>
      <Button ref={triggerRef} color="error" onClick={() => setOpen(true)}>
        Archive
      </Button>
      <Dialog open={open} onClose={close} aria-labelledby={`archive-title-${listingId}`}>
        <DialogTitle id={`archive-title-${listingId}`}>Archive listing?</DialogTitle>
        <DialogContent>
          “{listingTitle}” will no longer appear as an active listing. The backend may reject this action if the listing is sold or involved in an active order.
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={isLoading}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void archive()} disabled={isLoading}>
            {isLoading ? 'Archiving…' : 'Archive listing'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(message)} autoHideDuration={5000} onClose={() => setMessage(null)}>
        <Alert severity={severity} onClose={() => setMessage(null)}>{message}</Alert>
      </Snackbar>
    </>
  )
}
