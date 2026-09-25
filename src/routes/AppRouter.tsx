import { Button } from '@mui/material'
import { BrowserRouter, Link as RouterLink, Route, Routes } from 'react-router-dom'
import { StatePanel } from '../components/feedback/StatePanel'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ListingDetailsPage } from '../features/listings/pages/ListingDetailsPage'
import { ListingFormPage } from '../features/listings/pages/ListingFormPage'
import { ListingsPage } from '../features/listings/pages/ListingsPage'
import { MyListingsPage } from '../features/listings/pages/MyListingsPage'
import { ReviewFormPage } from '../features/reviews/pages/ReviewFormPage'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

const NotFoundPage = () => (
  <StatePanel
    severity="warning"
    title="Page not found"
    message="The page you requested does not exist."
    action={<Button component={RouterLink} to="/" variant="contained">Browse listings</Button>}
  />
)

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ListingsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="listings/:id" element={<ListingDetailsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="listings/new" element={<ListingFormPage />} />
          <Route path="listings/:id/edit" element={<ListingFormPage />} />
          <Route path="my/listings" element={<MyListingsPage />} />
          <Route path="orders/:orderId/review" element={<ReviewFormPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
