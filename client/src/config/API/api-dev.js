const protocol = 'http'
const host = '192.168.29.125:7001/api/v1'

// const protocol = "https";
// const host = "/api/v1";

const port = ''
const trailUrl = ''

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}/`
const endpoint = `${protocol}://${host}${port ? ':' + port : ''}${trailUrl}`

export const API_DEV = {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
}
