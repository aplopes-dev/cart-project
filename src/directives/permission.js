import { authorizationService } from '@/services/authorization.service'

/**
 * Diretiva para controle de acesso baseado em perfil
 * Uso: v-permission="'ADMIN'" ou v-permission="['ADMIN', 'MANAGER']"
 */
export const permission = {
  mounted(el, binding) {
    const { value } = binding
    
    if (!value) {
      console.warn('v-permission directive requires a value')
      return
    }
    
    if (!authorizationService.hasProfile(value)) {
      // Remove o elemento do DOM se o usuário não tem o perfil necessário
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

/**
 * Diretiva para controle de acesso baseado em permissão específica
 * Uso: v-has-permission="'write'" ou v-has-permission="['read', 'write']"
 */
export const hasPermission = {
  mounted(el, binding) {
    const { value } = binding
    
    if (!value) {
      console.warn('v-has-permission directive requires a value')
      return
    }
    
    const permissions = Array.isArray(value) ? value : [value]
    const hasAllPermissions = permissions.every(permission => 
      authorizationService.hasPermission(permission)
    )
    
    if (!hasAllPermissions) {
      // Remove o elemento do DOM se o usuário não tem todas as permissões necessárias
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
