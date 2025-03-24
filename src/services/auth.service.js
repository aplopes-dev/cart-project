import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      if (response.data.access_token) {
        const token = response.data.access_token
        const decodedToken = jwtDecode(token)
        
        const userData = {
          email: decodedToken.email,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          id: decodedToken.sub,
          phone: decodedToken.phone // Adicionando phone aos dados decodificados
        }
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        return {
          ...response.data,
          user: userData
        }
      }
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async signup(userData) {
    try {
      await axios.post(`${API_URL}/users`, {
        firstName: userData.firstName,  // Corrigido: enviando firstName diretamente
        lastName: userData.lastName,    // Corrigido: enviando lastName diretamente
        email: userData.email,
        password: userData.password
      })
      
      return this.login(userData.email, userData.password)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      const user = JSON.parse(userStr)
      return {
        ...user,
        phone: user.phone || '' // Garantindo que phone sempre exista, mesmo que vazio
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
      return null
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      
      // Verifica se o token não está expirado
      return decodedToken.exp > currentTime
    } catch {
      return false
    }
  }
}






