export const getFetch = async (
  endpoint: string,
  payload: object | false = false,
  method = 'GET'
) => {
  console.log(payload, method)
  if (payload && method === 'GET') method = 'POST'
  console.log(payload, method)
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
