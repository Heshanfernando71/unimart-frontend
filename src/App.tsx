import { CircularProgress, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useRefreshSessionMutation } from './features/auth/authApi'
import { AppRouter } from './routes/AppRouter'

function App() {
  const [refreshSession] = useRefreshSessionMutation()
  const [bootstrapped, setBootstrapped] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    void refreshSession()
      .unwrap()
      .catch(() => undefined)
      .finally(() => setBootstrapped(true))
  }, [refreshSession])

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3" role="status">
        <CircularProgress />
        <Typography color="text.secondary">Starting UniMart…</Typography>
      </div>
    )
  }

  return <AppRouter />
}

export default App
