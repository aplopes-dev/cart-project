<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 text-center font-archivo">
          {{ $t('auth.noProjectsTitle') }}
        </h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <div class="text-center">
          <p class="text-gray-600 mb-4 font-archivo">
            {{ $t('auth.noProjectsMessage') }}
          </p>
          <p class="text-sm text-gray-500 font-archivo">
            {{ $t('auth.noProjectsContact') }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-center">
        <button
          @click="handleClose"
          class="px-6 py-2 bg-empire-yellow text-black font-semibold rounded hover:bg-yellow-500 transition-colors font-archivo"
        >
          {{ $t('auth.understood') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoProjectsModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* Animações para o modal */
.transform {
  transition: all 0.3s ease-out;
}

/* Previne scroll do body quando modal está aberto */
.fixed {
  overflow: hidden;
}
</style>
