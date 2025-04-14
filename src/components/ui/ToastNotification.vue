<template>
  <transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 z-50 px-6 py-4 rounded-md shadow-lg"
      :class="typeClasses"
    >
      <p class="font-archivo-narrow text-lg">{{ message }}</p>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ToastNotification',
  setup() {
    const { visible, message, type } = useToast()

    const typeClasses = computed(() => {
      switch (type.value) {
        case 'success':
          return 'bg-black text-empire-yellow'
        case 'error':
          return 'bg-red-600 text-white'
        case 'warning':
          return 'bg-amber-500 text-white'
        case 'info':
          return 'bg-blue-500 text-white'
        default:
          return 'bg-black text-empire-yellow'
      }
    })

    return {
      visible,
      message,
      typeClasses
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
