import { useMainStore } from '@/stores/mainState'
import _ from 'lodash'
import { ElNotification } from 'element-plus'

// const mainStore = useMainStore()

export const getFetch = async (
    endpoint: string,
    payload: object | false = false,
    method = 'GET'
): Promise<any> => {
    console.log(endpoint, payload, method)
    // if (payload.filter) {
    //   const query = {}
    //   console.log(payload)
    //   query.filter = _.cloneDeep(payload.filter)
    //   delete payload.filter
    //   if (!Object.keys(payload).length) payload = false
    //   if (Object.keys(query)) endpoint = setQueryParams(query, endpoint)
    // }
    if (payload && method === 'GET') method = 'POST'
    console.log(payload, method)
    const headers = new Headers()
    headers.append('Access-Control-Allow-Credentials', 'include')
    headers.append('Access-Control-Allow-Origin', 'http://localhost:5173')
    headers.append('Content-Type', payload ? 'application/json;charset=utf-8' : 'text/plain')
    const options: RequestInit = {
        method: method.toUpperCase(),
        credentials: 'include',
        headers,
        // credentials: 'include',
        body: payload ? JSON.stringify(payload) : undefined
    }
    const rawData = await fetch(endpoint, options)
    // if (rawData.status === 401) useMainStore().setAuthState(false)
    console.log(rawData)
    const data = await rawData.json()
    console.log(data)
    return data
}

export const success = (message: string, title?: string) => {
    ElNotification({
        title: title,
        message: message,
        type: 'success'
    })
}
export const error = (message: string, title?: string) => {
    ElNotification({
        title: title,
        message: message,
        type: 'error'
    })
}
// const setQueryParams = (queryParams, endpoint) => {
//   console.log(queryParams)
//   if (queryParams.filter) {
//     endpoint += '?'
//     const filter = queryParams.filter
//     Object.keys(filter).forEach((key, idx) => {
//       if (filter[key]) endpoint += `${idx ? '&' : ''}${key}=${filter[key]}`
//     })
//     return endpoint
//   }
// }
