import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface ErrorBody {
  message?: unknown
  errors?: unknown
}

export interface ApiErrorInfo {
  status?: number | string
  message: string
  fieldErrors: Record<string, string>
}

const defaultMessage = (status?: number | string) => {
  switch (status) {
    case 400:
      return 'Some information was not accepted. Check the form and try again.'
    case 401:
      return 'Please sign in to continue.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested item could not be found.'
    case 409:
      return 'This action conflicts with the current state. It may already be completed.'
    case 'FETCH_ERROR':
    case 'TIMEOUT_ERROR':
      return 'We could not reach UniMart. Check your connection and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export const getApiError = (error: unknown): ApiErrorInfo => {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return { message: defaultMessage(), fieldErrors: {} }
  }

  const apiError = error as FetchBaseQueryError
  const body = 'data' in apiError && apiError.data && typeof apiError.data === 'object'
    ? (apiError.data as ErrorBody)
    : undefined
  const fieldErrors: Record<string, string> = {}

  if (body?.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
    for (const [field, message] of Object.entries(body.errors)) {
      if (typeof message === 'string') fieldErrors[field] = message
    }
  }

  const backendMessage = typeof body?.message === 'string' ? body.message.trim() : ''
  const safeBackendMessage = backendMessage.length <= 300 && !/(exception|stacktrace|\bat\s+\w+[.$])/i.test(backendMessage)
    ? backendMessage
    : ''

  return {
    status: apiError.status,
    message: safeBackendMessage || defaultMessage(apiError.status),
    fieldErrors,
  }
}

export const isNotFoundError = (error: unknown) =>
  Boolean(error && typeof error === 'object' && 'status' in error && error.status === 404)
