// const protocol = "http";
// const host = "192.168.29.125:7001/api/v1";

// const protocol = 'http'
// const host = 'localhost'

// const port = '3000'
// const trailUrl = '/api'

const protocol = 'https'
const host = 'halooadmin.herokuapp.com'

const port = ''
const trailUrl = '/api'

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}`
const endpoint = `${protocol}://${host}${port ? ':' + port : ''}${trailUrl}`

export const API_PROD = {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
}
