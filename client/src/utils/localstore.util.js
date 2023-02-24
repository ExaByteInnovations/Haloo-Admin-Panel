const sessionStoreUtil = {
  store_data: (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data))
    return true
  },

  get_data: (key) => {
    const item = sessionStorage.getItem(key)

    if (!item) return
    return JSON.parse(item)
  },

  remove_data: (key) => {
    sessionStorage.removeItem(key)
    return true
  },

  remove_all: () => {
    sessionStorage.clear()
    return true
  },
}

export default sessionStoreUtil
