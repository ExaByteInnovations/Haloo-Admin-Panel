const masterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IMG_EXTS':
      return {
        imgExtensions: action.payload,
      }
    default:
      return state
  }
}

export default masterReducer
