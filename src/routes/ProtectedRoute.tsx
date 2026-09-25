import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export const ProtectedRoute = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const location = useLocation()

  return accessToken
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />
}
