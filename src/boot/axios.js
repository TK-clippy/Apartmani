import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth.store'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const api = axios.create({ baseURL })

export default defineBoot(({ app, router }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  api.interceptors.request.use((config) => {
    const auth = useAuthStore()

    if (auth.token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        const auth = useAuthStore()
        auth.logout()
        router.replace('/login')
      }
      return Promise.reject(error)
    }
  )
})

export { api }
