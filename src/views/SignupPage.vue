<template>
  <div class="signup-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">SIGN UP</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-6 py-16">
          <div class="flex flex-col justify-center items-center p-16 gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Sign In Text -->
            <p class="w-full font-archivo text-[20px] leading-[30px] text-center text-[#1E1E1E]">
              Already have an account? 
              <router-link to="/login" class="text-empire-yellow hover:underline">Sign In</router-link>
            </p>

            <!-- Form Fields -->
            <div class="flex flex-col gap-4 w-full max-w-[682px]">
              <!-- First Name Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="text"
                  v-model="firstName"
                  placeholder="First Name"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Last Name Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="text"
                  v-model="lastName"
                  placeholder="Last Name"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Email Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="email"
                  v-model="email"
                  placeholder="E-mail"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Password Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="password"
                  v-model="password"
                  placeholder="Password"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Confirm Password Input -->
              <div class="flex flex-col gap-2">
                <input 
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Confirm Password"
                  class="w-full h-[48px] px-4 py-3 bg-white border border-[#1E1E1E] font-archivo font-bold text-[20px] leading-[20px] text-black/70"
                />
              </div>

              <!-- Create Account Button -->
              <div class="w-full mt-4">
                <button 
                  @click="handleSignup"
                  class="w-full bg-empire-yellow py-4 flex justify-center items-center"
                >
                  <span class="font-archivo-narrow font-semibold text-[28px] leading-[72px] text-black">
                    CREATE
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
export default {
  name: 'SignupPage',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    handleSignup() {
      // Implementar lógica de signup aqui
      console.log('Signup attempt:', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      })
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
</style>