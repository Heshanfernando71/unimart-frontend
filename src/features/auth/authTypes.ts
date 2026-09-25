export interface AuthUser {
  id: number
  email: string
  role: string
}

export interface AuthState {
  accessToken: string | null
  user: AuthUser | null
}

export interface LoginInput {
  email: string
  password: string
}

/**
 * The assignment describes an access token plus user identity but does not
 * provide the backend DTO name. Keep this adapter in one place if the real
 * AuthResponse uses different field names.
 */
export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
