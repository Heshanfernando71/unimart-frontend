import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: string
  description?: string
  action?: ReactNode
}

export const PageHeading = ({ title, description, action }: PageHeadingProps) => (
  <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <Typography component="h1" variant="h4">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" className="mt-1 max-w-3xl">
          {description}
        </Typography>
      )}
    </div>
    {action}
  </div>
)
