// API URL base - usando variável de ambiente do Vue
export const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

// Outras constantes que você pode precisar
export const DEFAULT_PAGE_SIZE = process.env.VUE_APP_DEFAULT_PAGE_SIZE || 10
export const CACHE_TIME = process.env.VUE_APP_CACHE_TIME || 3600000
export const REQUEST_TIMEOUT = process.env.VUE_APP_REQUEST_TIMEOUT || 30000