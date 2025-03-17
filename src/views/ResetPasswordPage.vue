<template>
  <div class="reset-password-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('auth.resetPasswordTitle') }}
          </h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-6 py-16">
          <div class="flex flex-col justify-center items-center p-16 gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Form -->
            <div class="flex flex-col gap-4 w-full max-w-[682px]">
              <!-- New Password Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="password"
                  v-model="newPassword"
                  :placeholder="$t('auth.newPassword')"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Confirm Password Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="password"
                  v-model="confirmPassword"
                  :placeholder="$t('auth.confirmPassword')"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Success Message -->
              <div v-if="successMessage" class="text-green-600 text-center font-archivo text-[16px]">
                {{ successMessage }}
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="text-red-600 text-center font-archivo text-[16px]">
                {{ errorMessage }}
              </div>

              <!-- Submit Button -->
              <div class="w-full mt-4">
                <button 
                  @click="handleSubmit"
                  :disabled="isLoading"
                  class="w-full bg-empire-yellow py-4 flex justify-center items-center disabled:opacity-50"
                >
                  <span class="font-archivo-narrow font-semibold text-[28px] leading-[72px] text-black">
                    {{ isLoading ? $t('common.loading') : $t('auth.resetPassword') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ResetPasswordPage',
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    
    const newPassword = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const handleSubmit = async () => {
      if (!newPassword.value || !confirmPassword.value) {
        errorMessage.value = t('auth.allFieldsRequired')
        return
      }

      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = t('auth.passwordsDoNotMatch')
        return
      }

      try {
        isLoading.value = true
        errorMessage.value = ''
        
        // Exemplo de implementação da chamada da API
        const resetToken = route.params.token
        console.log('Redefinindo senha com o token:', resetToken)
        // TODO: Implementar chamada real da API
        // await api.resetPassword(resetToken, newPassword.value)
        
        successMessage.value = t('auth.passwordResetSuccess')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        errorMessage.value = t('auth.passwordResetError')
      } finally {
        isLoading.value = false
      }
    }

    return {
      newPassword,
      confirmPassword,
      isLoading,
      successMessage,
      errorMessage,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.reset-password-page input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.reset-password-page input:focus {
  outline: none;
  border-color: #FFDD00;
}
</style>