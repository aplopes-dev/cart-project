import { ref } from 'vue'

// Estado global para o toast
const visible = ref(false)
const message = ref('')
const type = ref('success') // success, error, warning, info

export function useToast() {
  // Mostrar toast
  const showToast = (msg, toastType = 'success', duration = 3000) => {
    message.value = msg
    type.value = toastType
    visible.value = true
    
    // Esconder após a duração
    setTimeout(() => {
      visible.value = false
    }, duration)
  }
  
  return {
    visible,
    message,
    type,
    showToast
  }
}
