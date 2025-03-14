<template>
  <div class="login-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">{{ $t('auth.signIn') }}</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-6 py-16">
          <div class="flex flex-col justify-center items-center p-16 gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Sign Up Text -->
            <p class="w-full font-archivo text-[20px] leading-[30px] text-center text-[#1E1E1E]">
              {{ $t('auth.dontHaveAccount') }}
              <router-link to="/signup" class="text-empire-yellow hover:underline">{{ $t('auth.signUpFree') }}</router-link>
            </p>

            <!-- Form Fields -->
            <div class="flex flex-col gap-4 w-full max-w-[682px]">
              <!-- Email Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="email"
                  v-model="email"
                  :placeholder="$t('auth.email')"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Password Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="password"
                  v-model="password"
                  :placeholder="$t('auth.password')"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

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
                  class="w-full bg-empire-yellow py-4 flex justify-center items-center"
                >
                  <span class="font-archivo-narrow font-semibold text-[28px] leading-[72px] text-black">
                    {{ $t('auth.signIn') }}
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

export default {
  name: 'LoginPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // Implementar lógica de login aqui
      console.log('Login attempt:', { email: this.email, password: this.password })
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