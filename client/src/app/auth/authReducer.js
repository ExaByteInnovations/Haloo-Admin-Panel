const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        error: false,
      }
    case 'UPDATE_SUCCESS':
      return {
        user: action.payload,
        error: false,
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
