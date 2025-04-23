<template>
  <div class="forgot-password-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[36px] md:leading-[40px]">
            {{ $t('auth.forgotPasswordTitle') }}
          </h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-4 md:gap-6 py-4 md:py-8">
          <div class="flex flex-col justify-center items-center p-6 md:p-16 gap-3 md:gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Form -->
            <div class="flex flex-col gap-3 md:gap-4 w-full max-w-[682px]">
              <!-- Email Input -->
              <div class="flex flex-col gap-1 md:gap-2">
                <input
                  type="email"
                  v-model="email"
                  :placeholder="$t('auth.email')"
                  class="w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300"
                />
              </div>

              <!-- Success Message -->
              <div v-if="successMessage" class="text-green-600 text-center font-archivo text-[14px] md:text-[16px]">
                {{ successMessage }}
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="text-red-600 text-center font-archivo text-[14px] md:text-[16px]">
                {{ errorMessage }}
              </div>

              <!-- Submit Button -->
              <div class="w-full mt-2 md:mt-4">
                <button
                  @click="handleSubmit"
                  :disabled="isLoading"
                  class="w-full bg-empire-yellow py-2 md:py-4 flex justify-center items-center disabled:opacity-50"
                >
                  <span class="font-archivo-narrow font-semibold text-base md:text-[28px] leading-normal md:leading-[72px] text-black">
                    {{ isLoading ? $t('common.loading') : $t('auth.sendResetLink') }}
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
import { useRouter } from 'vue-router'

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const email = ref('')
    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const handleSubmit = async () => {
      if (!email.value) {
        errorMessage.value = t('auth.emailRequired')
        return
      }

      try {
        isLoading.value = true
        errorMessage.value = ''

        // Here you would implement the API call to send reset password email
        // await api.sendResetPasswordEmail(email.value)

        successMessage.value = t('auth.resetLinkSent')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        errorMessage.value = t('auth.resetLinkError')
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      isLoading,
      successMessage,
      errorMessage,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.forgot-password-page input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.forgot-password-page input:focus {
  outline: none;
  border-color: #FFDD00;
}

/* Estilos específicos para mobile */
@media (max-width: 768px) {
  .forgot-password-page input {
    font-size: 14px;
  }
}
</style>
