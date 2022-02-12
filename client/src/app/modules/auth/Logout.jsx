import {useContext, useEffect} from 'react'
import {Redirect, Switch} from 'react-router-dom'
import {AuthContext} from '../../auth/authContext'

export function Logout() {
  const {dispatch} = useContext(AuthContext)
  useEffect(() => {
    dispatch({
      type: 'LOGOUT',
    })
    document.location.reload()
  }, [dispatch])

  return (
    <Switch>
      <Redirect to='/auth/login' />
    </Switch>
  )
}
