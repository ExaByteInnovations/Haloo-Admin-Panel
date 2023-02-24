import {createContext, useEffect, useReducer} from 'react'
import {ApiGet} from '../../helpers/API/ApiData'
import masterReducer from './masterReducer'

const INITIAL_STATE = {
  imgExtensions: [],
}

export const MasterContext = createContext(INITIAL_STATE)

export const MasterContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(masterReducer, INITIAL_STATE)
  useEffect(() => {
    ApiGet(`setting/master`).then((response) => {
      if (response.status === 200) {
        dispatch({
          type: 'SET_IMG_EXTS',
          payload: response.data.data[0]?.validImageExtensions,
        })
      }
    })
  }, [])

  return (
    <MasterContext.Provider
      value={{
        imgExtensions: state.imgExtensions,
        dispatch,
      }}
    >
      {children}
    </MasterContext.Provider>
  )
}
