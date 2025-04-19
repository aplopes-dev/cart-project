import { ref } from 'vue'

// Global state for toast
const visible = ref(false)
const message = ref('')
const type = ref('success') // success, error, warning, info

export function useToast() {
  // Show toast
  const showToast = (msg, toastType = 'success', duration = 3000) => {
    message.value = msg
    type.value = toastType
    visible.value = true

    // Hide after duration
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
