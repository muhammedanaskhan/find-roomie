import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface AuthState {
  userName: string,
  email: string,
  accessToken: string,
  isUserAuthenticated?: boolean,
  avatar?: string
}

const initialState: AuthState = {
  userName: '',
  email: '',
  accessToken: '',
  isUserAuthenticated: false,
  avatar: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.userName = action.payload.userName,
        state.email = action.payload.email,
        state.accessToken = action.payload.accessToken,
        state.isUserAuthenticated = action.payload.isUserAuthenticated,
        state.avatar = action.payload.avatar
    },
  }
})

export const { setAuth } = authSlice.actions

export default authSlice.reducer