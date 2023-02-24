import {createContext, useEffect, useReducer} from 'react'
import authReducer from './authReducer'

const INITIAL_STATE = {
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  error: false,
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)
  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(state.user))
  }, [state.user])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
