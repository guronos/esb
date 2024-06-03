export const getFetch = async (endpoint: string, payload = false, method = 'GET') => {
  const headers = new Headers()
  headers.append('Content-Type', payload ? 'application/json;charset=utf-8' : 'text/plain')
  const options = {
    method: method.toUpperCase(),
    headers,
    body: payload ? JSON.stringify(payload) : undefined
  }
  const rawData = await fetch(endpoint, options)
  const data = await rawData.json()
  console.log(data)
  return data
}
