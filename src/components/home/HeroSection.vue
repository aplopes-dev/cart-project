<template>
  <section class="relative h-[70vh] md:h-screen">
    <!-- Loading Indicator -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div class="w-12 h-12 border-4 border-empire-yellow border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Carousel Container -->
    <div v-else class="absolute inset-0 overflow-hidden">
      <!-- Images -->
      <div class="flex h-full transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div
          v-for="(banner, index) in banners"
          :key="index"
          class="w-full h-full flex-shrink-0 relative"
        >
          <img
            :src="banner.image_url"
            :alt="`Banner ${index + 1}`"
            class="w-full h-full object-cover"
          >

          <!-- Overlay with content -->
          <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div class="text-center px-4 md:px-8">
              <h1
                class="text-xl sm:text-3xl md:text-6xl font-bold mb-1 md:mb-4"
                :style="{ color: banner.title_color }"
              >
                {{ banner.title }}
              </h1>
              <p
                class="text-xs sm:text-base md:text-xl mb-3 md:mb-6 max-w-2xl mx-auto"
                :style="{ color: banner.subtitle_color }"
              >
                {{ banner.subtitle }}
              </p>
              <router-link
                to="/categories"
                class="bg-empire-yellow text-black px-3 sm:px-5 md:px-8 py-1.5 sm:py-2.5 md:py-4 rounded-full text-xs sm:text-sm md:text-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                {{ $t('hero.shopNow') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="banners.length > 1"
        @click="prevSlide"
        class="absolute left-2 md:left-8 top-[60%] md:top-1/2 -translate-y-1/2 w-10 h-10 md:w-[72px] md:h-[72px] flex items-center justify-center md:bg-white/20 md:border-2 md:border-white transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="md:w-12 md:h-12">
          <path d="M31.5 12L18 24L31.5 36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button
        v-if="banners.length > 1"
        @click="nextSlide"
        class="absolute right-2 md:right-8 top-[60%] md:top-1/2 -translate-y-1/2 w-10 h-10 md:w-[72px] md:h-[72px] flex items-center justify-center md:bg-white/20 md:border-2 md:border-white transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="transform rotate-180 md:w-12 md:h-12">
          <path d="M31.5 12L18 24L31.5 36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Dots Indicator -->
      <div v-if="banners.length > 1" class="absolute bottom-[40px] md:bottom-[72px] left-1/2 -translate-x-1/2 flex flex-row items-center gap-[13px] max-w-[90vw] overflow-x-auto scrollbar-hide">
        <div
          v-for="(_, index) in banners"
          :key="index"
          @click="currentSlide = index"
          class="flex justify-center items-center transition-all duration-300 flex-shrink-0"
          :class="[
            currentSlide === index
              ? 'bg-[#FFDD00]'
              : 'bg-white/15 border-2 border-white',
            // Tamanho responsivo baseado na quantidade de banners
            banners.length <= 3 ? 'w-[72px] h-[6px]' : // Tamanho original para 3 ou menos
            banners.length <= 5 ? 'w-[50px] md:w-[72px] h-[6px]' : // Tamanho médio para 4-5
            'w-[30px] md:w-[72px] h-[6px]' // Tamanho pequeno para 6+
          ]"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// State
const currentSlide = ref(0)
const banners = ref([])
const loading = ref(true)
const autoSlideInterval = ref(null)

// API URL
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

// Fetch banners
const fetchBanners = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings/home-banners?active=true`)
    banners.value = response.data.sort((a, b) => a.position - b.position)

    // Fallback to default banners if none are returned
    if (banners.value.length === 0) {
      banners.value = [
        {
          id: 'default',
          title: 'Your Best Online Shop',
          subtitle: 'Discover our amazing collection of products with the best prices in the market.',
          image_url: '/images/banner/hero-image-1.png',
          title_color: '#FFFFFF',
          subtitle_color: '#FFFFFF'
        }
      ]
    }
  } catch (err) {
    console.error('Error fetching banners:', err)
    // Fallback to default banner
    banners.value = [
      {
        id: 'default',
        title: 'Your Best Online Shop',
        subtitle: 'Discover our amazing collection of products with the best prices in the market.',
        image_url: '/images/banner/hero-image-1.png',
        title_color: '#FFFFFF',
        subtitle_color: '#FFFFFF'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Navigation methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + banners.value.length) % banners.value.length
}

// Auto slide
const startAutoSlide = () => {
  if (banners.value.length > 1) {
    autoSlideInterval.value = setInterval(nextSlide, 5000)
  }
}

// Lifecycle hooks
onMounted(async () => {
  await fetchBanners()
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>



