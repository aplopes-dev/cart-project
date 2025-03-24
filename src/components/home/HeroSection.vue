<template>
  <section class="relative h-screen">
    <!-- Carousel Container -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Images -->
      <div class="flex h-full transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <img 
          v-for="(image, index) in images" 
          :key="index"
          :src="image.src" 
          :alt="image.alt"
          class="w-full h-full object-cover flex-shrink-0"
        >
      </div>

      <!-- Overlay with content -->
      <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div class="text-center text-white px-4 md:px-8">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 md:mb-6">{{ images[currentSlide].title }}</h1>
          <p class="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">{{ images[currentSlide].description }}</p>
          <router-link to="/categories" class="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-gray-100 transition-colors">
            {{ $t('hero.shopNow') }}
          </router-link>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        @click="prevSlide" 
        class="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-[72px] md:h-[72px] flex items-center justify-center md:bg-white/20 md:border-2 md:border-white transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="md:w-12 md:h-12">
          <path d="M31.5 12L18 24L31.5 36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button 
        @click="nextSlide" 
        class="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-[72px] md:h-[72px] flex items-center justify-center md:bg-white/20 md:border-2 md:border-white transition-colors"
      >
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="transform rotate-180 md:w-12 md:h-12">
          <path d="M31.5 12L18 24L31.5 36" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Dots Indicator -->
      <div class="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex flex-row items-center gap-[13px] w-[242px] h-[6px]">
        <div 
          v-for="(_, index) in images" 
          :key="index"
          @click="currentSlide = index"
          class="flex justify-center items-center w-[72px] h-[6px] transition-all duration-300"
          :class="[
            currentSlide === index 
              ? 'bg-[#FFDD00]' 
              : 'bg-white/15 border-2 border-white'
          ]"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      currentSlide: 0,
      images: [
        {
          src: '/images/hero-image-1.png',
          alt: 'Hero Image 1',
          title: 'Your Best Online Shop',
          description: 'Discover our amazing collection of products with the best prices in the market.'
        },
        {
          src: '/images/hero-image-2.png',
          alt: 'Hero Image 2',
          title: 'Special Offers',
          description: 'Get up to 50% off on selected items this week only!'
        },
        {
          src: '/images/hero-image-3.png',
          alt: 'Hero Image 3',
          title: 'New Collection',
          description: 'Check out our latest arrivals and stay ahead of the trends.'
        },
        {
          src: '/images/hero-image-4.png',
          alt: 'Hero Image 4',
          title: 'Premium Quality',
          description: 'Experience the difference with our premium quality products.'
        },
        {
          src: '/images/hero-image-5.png',
          alt: 'Hero Image 5',
          title: 'Free Shipping',
          description: 'Enjoy free shipping on all orders over $50!'
        }
      ]
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.images.length
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length
    },
    startAutoSlide() {
      setInterval(this.nextSlide, 5000)
    }
  },
  mounted() {
    this.startAutoSlide()
  }
}
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
</style>



