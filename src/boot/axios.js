import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
console.log('API base URL:', baseURL)

const api = axios.create({ baseURL })

export default defineBoot(({ app }) => {
  // Optional: expose axios globally (Options API)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
