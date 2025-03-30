import { authService } from './auth.service'

// Definição dos perfis e suas permissões
const PERMISSIONS = {
  ADMIN: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
  MANAGER: ['read', 'write', 'delete'],
  USER: ['read']
}

export const authorizationService = {
  /**
   * Verifica se o usuário atual tem a permissão especificada
   * @param {string} permission - A permissão a ser verificada
   * @returns {boolean} - Verdadeiro se o usuário tem a permissão, falso caso contrário
   */
  hasPermission(permission) {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return false
    
    const profile = currentUser.profile || 'USER'
    const userPermissions = PERMISSIONS[profile] || []
    
    return userPermissions.includes(permission)
  },
  
  /**
   * Verifica se o usuário atual tem o perfil especificado
   * @param {string|string[]} profiles - O perfil ou array de perfis a serem verificados
   * @returns {boolean} - Verdadeiro se o usuário tem um dos perfis, falso caso contrário
   */
  hasProfile(profiles) {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return false
    
    const userProfile = currentUser.profile || 'USER'
    
    if (Array.isArray(profiles)) {
      return profiles.includes(userProfile)
    }
    
    return userProfile === profiles
  },
  
  /**
   * Obtém o perfil do usuário atual
   * @returns {string} - O perfil do usuário atual ou 'USER' como padrão
   */
  getUserProfile() {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return 'USER'
    
    return currentUser.profile || 'USER'
  }
}
