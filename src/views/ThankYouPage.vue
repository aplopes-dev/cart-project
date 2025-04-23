<template>
  <div class="thank-you-page bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto py-8 md:py-16">
        <div class="text-center space-y-4 md:space-y-8">
          <!-- Check Icon -->
          <div class="flex justify-center">
            <div class="w-16 h-16 md:w-24 md:h-24 bg-empire-yellow rounded-full flex items-center justify-center">
              <svg width="32" height="32" class="md:w-12 md:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 33.5L8.5 23.5L11.5 20.5L18.5 27.5L36.5 9.5L39.5 12.5L18.5 33.5Z" fill="black"/>
              </svg>
            </div>
          </div>

          <!-- Thank You Message -->
          <h1 class="font-archivo-narrow font-semibold text-3xl md:text-[48px] leading-[40px] md:leading-[56px]">
            {{ $t('thankYou.title') }}
          </h1>

          <!-- Order Number -->
          <p class="font-archivo text-lg md:text-[22px] leading-[24px] md:leading-[32px] text-black/70">
            {{ $t('thankYou.orderNumber') }}{{ orderNumber }}
          </p>

          <!-- Email Message -->
          <p class="font-archivo text-lg md:text-[22px] leading-[24px] md:leading-[32px] text-black/70 max-w-[600px] mx-auto">
            {{ $t('thankYou.emailConfirmation') }}
          </p>

          <!-- Continue Shopping Button -->
          <div class="pt-4 md:pt-8">
            <button
              @click="goToHome"
              class="bg-empire-yellow px-6 md:px-12 py-3 md:py-4 font-archivo-narrow font-semibold text-xl md:text-[34px] leading-[28px] md:leading-[40px] hover:opacity-90 transition-opacity"
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
import { useRouter } from 'vue-router'

export default {
  name: 'ThankYouPage',
  props: {
    orderNumber: {
      type: String,
      required: true
    }
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const goToHome = () => {
      router.push('/')
    }

    return {
      t,
      goToHome
    }
  },
  created() {
    console.log('Order number prop:', this.orderNumber);

    if (!this.orderNumber) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.thank-you-page {
  min-height: calc(100vh - 140px); /* Versão mobile */
}

@media (min-width: 768px) {
  .thank-you-page {
    min-height: calc(100vh - 180px); /* Versão desktop */
  }
}
</style>






