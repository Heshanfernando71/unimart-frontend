import { Alert, Button, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface StatePanelProps {
  title: string
  message: string
  severity?: 'info' | 'warning' | 'error'
  actionLabel?: string
  onAction?: () => void
  action?: ReactNode
}

export const StatePanel = ({
  title,
  message,
  severity = 'info',
  actionLabel,
  onAction,
  action,
}: StatePanelProps) => (
  <Paper variant="outlined" className="mx-auto max-w-2xl p-6 text-center sm:p-10">
    <Alert severity={severity} className="mb-4 text-left">
      {message}
    </Alert>
    <Typography component="h2" variant="h5" gutterBottom>
      {title}
    </Typography>
    {action ?? (actionLabel && onAction ? (
      <Button variant="contained" onClick={onAction} className="mt-3">
        {actionLabel}
      </Button>
    ) : null)}
  </Paper>
)
