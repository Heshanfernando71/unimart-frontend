import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse, AuthState } from './authTypes'

const initialState: AuthState = {
  accessToken: null,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived: (state, action: PayloadAction<AuthResponse>) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    },
    signedOut: (state) => {
      state.accessToken = null
      state.user = null
    },
  },
})

export const { credentialsReceived, signedOut } = authSlice.actions
export default authSlice.reducer
