<template>
  <div class="login-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">{{ $t('auth.signIn') }}</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-6 py-8">
          <div class="flex flex-col justify-center items-center p-16 gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Sign Up Text -->
            <p class="w-full font-archivo text-[20px] leading-[30px] text-center text-[#1E1E1E]">
              {{ $t('auth.dontHaveAccount') }}
              <a 
                @click.prevent="goToSignup" 
                href="#" 
                class="text-empire-yellow hover:underline cursor-pointer"
              >
                {{ $t('auth.signUpFree') }}
              </a>
            </p>

            <!-- Form -->
            <div class="w-full flex flex-col gap-4">
              <!-- Email Input -->
              <input
                v-model="email"
                type="email"
                :placeholder="$t('auth.email')"
                class="w-full p-4 border border-gray-300"
              />

              <!-- Password Input -->
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.password')"
                  class="w-full p-4 border border-gray-300"
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
              </div>

              <!-- Error Message -->
              <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

              <!-- Forgot Password -->
              <router-link 
                to="/forgot-password"
                class="w-full font-archivo text-[20px] leading-[30px] text-center text-[#1E1E1E] hover:text-empire-yellow"
              >
                {{ $t('auth.forgotPassword') }}
              </router-link>

              <!-- Sign In Button -->
              <div class="w-full mt-4">
                <button 
                  @click="handleLogin"
                  :disabled="isLoading"
                  class="w-full bg-empire-yellow py-4 flex justify-center items-center"
                >
                  <span class="font-archivo-narrow font-semibold text-[28px] leading-[72px] text-black">
                    {{ isLoading ? $t('auth.loading') : $t('auth.signIn') }}
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
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref, getCurrentInstance, nextTick } from 'vue'

export default {
  name: 'LoginPage',
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const app = getCurrentInstance()
    const toast = app.appContext.config.globalProperties.$toast

    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)

    const handleLogin = async () => {
      try {
        isLoading.value = true
        error.value = ''
        
        await store.dispatch('login', {
          email: email.value,
          password: password.value
        })
        
        await store.dispatch('updateUser')
        await nextTick()

        // Verifica se existe um redirecionamento pendente
        const redirectPath = route.query.redirect
        if (redirectPath) {
          router.push({ path: redirectPath })
        } else {
          router.push({ path: '/', replace: true })
        }
      } catch (err) {
        console.error('Login error:', err)
        const errorMessage = err.response?.data?.message === 'Invalid credentials' 
          ? t('auth.invalidCredentials')
          : t('auth.loginError')
        
        error.value = errorMessage
        toast.error(errorMessage)
      } finally {
        isLoading.value = false
      }
    }

    // Adicionar método para ir para signup mantendo o redirecionamento
    const goToSignup = () => {
      // Mantém o mesmo redirect que veio do checkout
      const query = route.query.redirect ? { redirect: route.query.redirect } : {}
      router.push({ 
        path: '/signup',
        query
      })
    }

    return {
      email,
      password,
      error,
      isLoading,
      showPassword,
      handleLogin,
      goToSignup,
      t
    }
  }
}
</script>

<style scoped>
.login-page input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.login-page input:focus {
  outline: none;
  border-color: #FFDD00;
}
</style>










