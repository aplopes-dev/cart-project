<template>
  <div class="signup-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">{{ $t('auth.signUp') }}</h1>
        </div>

        <!-- Conteúdo Principal - Reduzido o py-16 para py-8 -->
        <div class="flex flex-col justify-center items-center px-4 gap-6 py-8">
          <div class="flex flex-col justify-center items-center p-16 gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Sign In Text -->
            <p class="w-full font-archivo text-[20px] leading-[30px] text-center text-[#1E1E1E]">
              {{ $t('auth.alreadyHaveAccount') }}
              <router-link to="/login" class="text-empire-yellow hover:underline">{{ $t('auth.signIn') }}</router-link>
            </p>

            <!-- Form -->
            <div class="w-full flex flex-col gap-4">
              <!-- First Name Input -->
              <input 
                type="text"
                v-model="firstName"
                :placeholder="$t('auth.firstName')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !firstName) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !firstName" class="text-red-500 text-sm">
                {{ $t('auth.fieldRequired') }}
              </span>

              <!-- Last Name Input -->
              <input 
                type="text"
                v-model="lastName"
                :placeholder="$t('auth.lastName')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !lastName) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !lastName" class="text-red-500 text-sm">
                {{ $t('auth.fieldRequired') }}
              </span>

              <!-- Email Input -->
              <input 
                type="email"
                v-model="email"
                :placeholder="$t('auth.email')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !email) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !email" class="text-red-500 text-sm">
                {{ $t('auth.fieldRequired') }}
              </span>

              <!-- Password Input -->
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  :placeholder="$t('auth.password')"
                  :class="[
                    'w-full p-4 border',
                    (showErrors && !password) ? 'border-red-500' : 'border-gray-300'
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <svg
                    v-if="showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <span v-if="showErrors && !password" class="text-red-500 text-sm">
                  {{ $t('auth.fieldRequired') }}
                </span>
              </div>

              <!-- Confirm Password Input -->
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  :placeholder="$t('auth.confirmPassword')"
                  :class="[
                    'w-full p-4 border',
                    (showErrors && !confirmPassword) ? 'border-red-500' : 'border-gray-300'
                  ]"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <svg
                    v-if="showConfirmPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <span v-if="showErrors && !confirmPassword" class="text-red-500 text-sm">
                  {{ $t('auth.fieldRequired') }}
                </span>
              </div>

              <!-- Error Message -->
              <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

              <!-- Sign Up Button -->
              <div class="w-full mt-4">
                <button 
                  @click="handleSignup"
                  :disabled="isLoading"
                  class="w-full bg-empire-yellow py-4 flex justify-center items-center"
                >
                  <span class="font-archivo-narrow font-semibold text-[28px] leading-[72px] text-black">
                    {{ isLoading ? $t('auth.loading') : $t('auth.signUp') }}
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
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref, getCurrentInstance } from 'vue'

export default {
  name: 'SignupPage',
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const app = getCurrentInstance()
    const toast = app.appContext.config.globalProperties.$toast

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showErrors = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    const handleSignup = async () => {
      showErrors.value = true

      if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
        toast.error(t('auth.allFieldsRequired'))
        error.value = t('auth.allFieldsRequired')
        return
      }

      if (password.value !== confirmPassword.value) {
        toast.error(t('auth.passwordsDoNotMatch'))
        error.value = t('auth.passwordsDoNotMatch')
        return
      }

      if (password.value.length < 6) {
        toast.error(t('auth.passwordTooShort'))
        error.value = t('auth.passwordTooShort')
        return
      }

      try {
        isLoading.value = true
        error.value = ''

        await store.dispatch('signup', {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        })

        // Substituir checkAuth por updateUser
        await store.dispatch('updateUser')
        
        toast.success(t('auth.signupSuccess'))
        showErrors.value = false
        
        setTimeout(() => {
          router.push('/')
        }, 1500)

      } catch (err) {
        let errorMessage = t('auth.signupError')
        
        // Tratando erros específicos da API
        if (err.response?.status === 400) {
          if (err.response.data?.message?.includes('email')) {
            errorMessage = t('auth.emailAlreadyExists')
          } else if (err.response.data?.message?.includes('password')) {
            errorMessage = t('auth.invalidPassword')
          }
        }

        toast.error(errorMessage)
        error.value = errorMessage
      } finally {
        isLoading.value = false
      }
    }

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      error,
      isLoading,
      showErrors,
      showPassword,
      showConfirmPassword,
      handleSignup,
      t
    }
  }
}
</script>

<style scoped>
.signup-page input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.signup-page input:focus {
  outline: none;
  border-color: #FFDD00;
}

/* Adicionar estilo para garantir que o ícone do olho não interfira com o texto da senha */
input[type="password"],
input[type="text"] {
  padding-right: 2.5rem;
}
</style>





