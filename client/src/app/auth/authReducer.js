const authReducer = (state, action) => {
  switch (action.type) {
    // case 'LOGIN_START':
    //   return {
    //     user: null,
    //     error: false,
    //   }
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        error: false,
      }
    // case 'LOGIN_FAILURE':
    //   return {
    //     user: null,
    //     error: true,
    //   }
    case 'UPDATE_START':
      return {
        ...state,
      }
    case 'UPDATE_SUCCESS':
      return {
        user: action.payload,
        error: false,
      }
    case 'UPDATE_FAILURE':
      return {
        user: state.user,
        error: true,
      }
    case 'LOGOUT':
      return {
        user: null,
        error: false,
      }

    default:
      return state
  }
}

export default authReducer
