import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Create an Axios instance with a base URL from runtime configuration
  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
  })

  // Add a request interceptor
  api.interceptors.request.use((config) => {
    // Example: Add a token to the request headers if needed
    const token = 'your-token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config // Always return the config object
  }, (error) => {
    // Handle request error here
    return Promise.reject(error)
  })

  // Add a response interceptor
  api.interceptors.response.use((response) => {
    // Process the response data before passing it to the caller
    return response
  }, (error) => {
    // Handle response errors, like failed status codes
    return Promise.reject(error)
  })

  // Provide the Axios instance to Nuxt, allowing it to be used across the application
  return {
    provide: {
      api,
    },
  }
})
