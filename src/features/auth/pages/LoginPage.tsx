import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAppSelector } from '../../../app/hooks'
import { getApiError } from '../../../utils/apiError'
import { useLoginMutation } from '../authApi'
import type { LoginInput } from '../authTypes'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

interface LoginLocationState {
  from?: { pathname?: string }
}

export const LoginPage = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [login] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const destination = state?.from?.pathname ?? '/'
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (user) return <Navigate to={destination} replace />

  const submit = handleSubmit(async (values) => {
    setErrorMessage(null)
    try {
      await login(values).unwrap()
      navigate(destination, { replace: true })
    } catch (error) {
      setErrorMessage(getApiError(error).message)
    }
  })

  return (
    <div className="mx-auto flex max-w-md justify-center py-8 sm:py-16">
      <Paper elevation={1} className="w-full p-6 sm:p-8">
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome back
        </Typography>
        <Typography color="text.secondary" className="mb-6">
          Sign in with your UniMart account to create listings and manage your marketplace activity.
        </Typography>
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            label="Email address"
            type="email"
            autoComplete="email"
            autoFocus
            required
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Paper>
    </div>
  )
}
