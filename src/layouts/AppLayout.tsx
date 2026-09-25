import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { signedOut } from '../features/auth/authSlice'
import { baseApi } from '../services/baseApi'

interface NavigationProps {
  onNavigate?: () => void
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const signOut = () => {
    dispatch(signedOut())
    dispatch(baseApi.util.resetApiState())
    onNavigate?.()
  }

  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-2 md:flex-row md:items-center">
      <Button component={NavLink} to="/" onClick={onNavigate} color="inherit">Browse listings</Button>
      {user ? (
        <>
          <Button component={NavLink} to="/my/listings" onClick={onNavigate} color="inherit">My listings</Button>
          <Button component={NavLink} to="/listings/new" onClick={onNavigate} color="inherit">Create listing</Button>
          <Typography variant="body2" className="px-2" title={user.email}>{user.email}</Typography>
          <Button onClick={signOut} color="inherit">Sign out</Button>
        </>
      ) : (
        <Button component={NavLink} to="/login" onClick={onNavigate} color="inherit">Sign in</Button>
      )}
    </nav>
  )
}

export const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters className="gap-3">
            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              color="inherit"
              className="flex-1 no-underline"
              aria-label="UniMart home"
            >
              UniMart
            </Typography>
            <div className="hidden md:block"><Navigation /></div>
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-72 p-4">
          <Typography variant="h6" className="px-2 py-3">UniMart menu</Typography>
          <Divider className="mb-3" />
          <Navigation onNavigate={() => setDrawerOpen(false)} />
        </div>
      </Drawer>
      <Container component="main" maxWidth="lg" className="flex-1 py-7 sm:py-10">
        <Outlet />
      </Container>
      <footer className="border-t border-slate-200 bg-white py-5 text-center">
        <Typography variant="body2" color="text.secondary">UniMart · A marketplace for the university community</Typography>
      </footer>
    </div>
  )
}
