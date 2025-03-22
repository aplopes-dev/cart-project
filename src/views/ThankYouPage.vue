<template>
  <div class="thank-you-page bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto py-16">
        <div class="text-center space-y-8">
          <!-- Check Icon -->
          <div class="flex justify-center">
            <div class="w-24 h-24 bg-empire-yellow rounded-full flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 33.5L8.5 23.5L11.5 20.5L18.5 27.5L36.5 9.5L39.5 12.5L18.5 33.5Z" fill="black"/>
              </svg>
            </div>
          </div>

          <!-- Thank You Message -->
          <h1 class="font-archivo-narrow font-semibold text-[48px] leading-[56px]">
            {{ $t('thankYou.title') }}
          </h1>

          <!-- Order Number -->
          <p class="font-archivo text-[22px] leading-[32px] text-black/70">
            {{ $t('thankYou.orderNumber') }}{{ orderNumber }}
          </p>

          <!-- Email Message -->
          <p class="font-archivo text-[22px] leading-[32px] text-black/70 max-w-[600px] mx-auto">
            {{ $t('thankYou.emailConfirmation') }}
          </p>

          <!-- Continue Shopping Button -->
          <div class="pt-8">
            <button 
              @click="goToHome"
              class="bg-empire-yellow px-12 py-4 font-archivo-narrow font-semibold text-[34px] leading-[40px] hover:opacity-90 transition-opacity"
            >
              {{ $t('thankYou.continueShopping') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ThankYouPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      orderNumber: null
    }
  },
  created() {
    this.orderNumber = this.$route.params.orderNumber
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.thank-you-page {
  min-height: calc(100vh - 180px); /* Ajuste conforme necessário para compensar header e footer */
}
</style>
