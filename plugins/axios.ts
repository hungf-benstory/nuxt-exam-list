import axios from 'axios';
import { useToast } from "primevue/usetoast";
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const toast = useToast()

  // Create an Axios instance with a base URL
  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  // Add a request interceptor
  api.interceptors.request.use((config) => {

    // Example: Add a token to the request header if needed
    const token = 'your-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add a response interceptor
  api.interceptors.response.use((response) => {
    return response;
  }, (error) => {

    // Display the error using PrimeVue Toast
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'API request failed',
        life: 3000
      });
    }
    return Promise.reject(error);
  });

  // Provide the Axios instance to the Nuxt app
  nuxtApp.provide('api', api);
});
