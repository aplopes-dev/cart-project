<template>
  <header :class="[
    'w-full z-[100]',
    { 'fixed bg-black/30': isHomePage, 'relative bg-black': !isHomePage }
  ]">
    <div class="relative flex flex-col items-center px-4 py-1.5 w-full !bg-black/30"> <!-- Reduzido py-3 para py-1.5 -->
      <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-0 md:px-8 py-1.5"> <!-- Alterado px-4 para px-0 -->
        <!-- Logo e Botões Mobile -->
        <div class="flex flex-col w-full md:w-auto">
          <!-- Primeira linha: Logo, Email, Phone e Menu Sanduíche -->
          <div class="flex justify-end items-center w-full">
            <router-link to="/" class="mr-auto pl-0 md:pl-4"> <!-- Adicionado pl-0 para mobile e pl-4 para desktop -->
              <img 
                :src="logoUrl" 
                alt="Logo" 
                class="w-[180px] h-[103.28px] object-contain"
                @error="handleImageError"
              >
            </router-link>
            
            <!-- Container dos ícones mobile -->
            <div class="flex items-center md:gap-6 gap-2 md:ml-0 md:hidden"> <!-- Corrigido a ordem das classes -->
              <!-- Language Selector Mobile -->
              <div class="relative md:hidden">
                <button 
                  @click="isOpen = !isOpen"
                  class="flex items-center gap-2 bg-transparent cursor-pointer p-1"
                >
                  <img 
                    :src="flagImages[selectedLanguage]"
                    class="w-7 h-7"
                    :alt="`${selectedLanguage} flag`"
                  />
                  <svg 
                    class="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="#FFFFFF"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>

                <!-- Dropdown Mobile (apenas ícones) -->
                <div 
                  v-if="isOpen" 
                  class="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50 min-w-[100px]"
                >
                  <button
                    v-for="lang in ['FR', 'EN', 'PT']"
                    :key="lang"
                    @click="selectLanguage(lang)"
                    class="flex items-center justify-center w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <img 
                      :src="flagImages[lang]"
                      class="w-6 h-6"
                      :alt="`${lang} flag`"
                    />
                  </button>
                </div>
              </div>
              
              <!-- Email com tooltip -->
              <div class="relative">
                <button 
                  class="flex items-center"
                  @mouseenter="showEmailTooltip = true"
                  @mouseleave="showEmailTooltip = false"
                  @click="showEmailTooltip = !showEmailTooltip"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                </button>
                <div 
                  v-show="showEmailTooltip" 
                  class="absolute right-0 top-8 bg-black/90 text-white px-4 py-2 rounded-lg whitespace-nowrap z-50"
                >
                  info@empirecanada.ca
                </div>
              </div>

              <!-- Phone com tooltip -->
              <div class="relative">
                <button 
                  class="flex items-center"
                  @mouseenter="showPhoneTooltip = true"
                  @mouseleave="showPhoneTooltip = false"
                  @click="showPhoneTooltip = !showPhoneTooltip"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </button>
                <div 
                  v-show="showPhoneTooltip" 
                  class="absolute right-0 top-8 bg-black/90 text-white px-4 py-2 rounded-lg whitespace-nowrap z-50"
                >
                  514 745-1080
                </div>
              </div>

              <!-- Menu Button -->
              <button class="md:hidden flex items-center" @click="toggleMobileMenu">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Segunda linha: Carrinho e Sign in (apenas mobile) -->
          <div class="flex md:hidden justify-end items-center gap-6 mt-0.5">
            <button @click="toggleCart" class="relative flex items-center">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </button>
            <router-link to="/login" class="text-[15px] leading-7 text-white font-archivo font-medium">Sign in</router-link>
          </div>
        </div>

        <!-- Desktop Navigation and Actions -->
        <div class="hidden md:flex items-center gap-6">
          <div class="flex flex-row items-center gap-8 w-[471px] h-[56px] mx-auto">
            <!-- Phone -->
            <div class="flex flex-row items-center gap-4 w-[205px] h-[56px]">
              <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-[150px] p-[10px]">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div class="flex flex-col justify-center w-[137px] h-[56px]">
                <span class="font-archivo font-medium text-[15px] leading-7 text-empire-yellow">Call us today</span>
                <span class="font-archivo font-bold text-[19px] leading-7 text-white">514 745-1080</span>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-row items-center gap-4 w-[234px] h-[56px]">
              <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-[150px] p-[10px]">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </div>
              <div class="flex flex-col justify-center w-[166px] h-[56px]">
                <span class="font-archivo font-medium text-[15px] leading-7 text-empire-yellow">Chat with us</span>
                <span class="font-archivo font-bold text-[19px] leading-7 text-white">info@empirecanada.ca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lower Section - Navigation -->
      <div class="hidden md:flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-4 py-1.5 border-t border-[rgba(78,78,78,0.35)]"> <!-- Reduzido py-3 para py-1.5 -->
        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 mb-4 md:mb-0">
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">{{ $t('header.home') }}</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">{{ $t('header.history') }}</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">{{ $t('header.suppliers') }}</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1">
            {{ $t('header.shop') }}
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#FBBD1E">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">{{ $t('header.career') }}</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">{{ $t('header.contactUs') }}</a>
        </nav>

        <!-- Right Section -->
        <div class="flex flex-wrap justify-center items-center gap-4">
          <!-- Language Desktop (ícones + texto) -->
          <div class="relative hidden md:block">
            <button 
              @click="isOpen = !isOpen"
              class="flex items-center gap-2 text-[15px] leading-7 text-white font-archivo font-medium bg-transparent cursor-pointer pl-2 pr-6"
            >
              <img 
                :src="flagImages[selectedLanguage]"
                class="w-5 h-5"
                :alt="`${selectedLanguage} flag`"
              />
              {{ selectedLanguage }}
              <svg 
                class="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="#FFFFFF"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Dropdown Desktop (ícones + texto) -->
            <div 
              v-if="isOpen" 
              class="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50 min-w-[100px]"
            >
              <button
                v-for="lang in ['FR', 'EN', 'PT']"
                :key="lang"
                @click="selectLanguage(lang)"
                class="flex items-center gap-2 w-full px-4 py-2 text-black hover:bg-gray-100"
              >
                <img 
                  :src="flagImages[lang]"
                  class="w-5 h-5"
                  :alt="`${lang} flag`"
                />
                {{ lang }}
              </button>
            </div>
          </div>

          <!-- Cart and Sign In -->
          <div class="flex items-center gap-6">
            <button @click="toggleCart" class="relative flex items-center">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </button>
            <router-link to="/login" class="text-[15px] leading-7 text-white font-archivo font-medium">Sign in</router-link>
          </div>

          <!-- Search -->
          <div class="flex items-center justify-between px-4 py-2 w-full md:w-[213px] h-[42px] border-2 border-white rounded-full">
            <span class="text-[15px] leading-7 text-white font-archivo font-medium">Search</span>
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden w-full">
        <!-- Navigation Links Mobile -->
        <nav class="grid grid-cols-4 gap-2 w-full py-4 border-t border-[rgba(78,78,78,0.35)]">
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">{{ $t('header.home') }}</a>
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">{{ $t('header.history') }}</a>
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">{{ $t('header.suppliers') }}</a>
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center flex items-center justify-center gap-1">
            {{ $t('header.shop') }}
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#FBBD1E">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </a>
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">{{ $t('header.career') }}</a>
          <a href="#" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">{{ $t('header.contactUs') }}</a>
       
          <!-- Mobile Search -->
          <div class="col-span-4 mx-4 mt-2 flex items-center justify-between px-4 py-2 border-2 border-white rounded-full">
            <span class="text-[15px] leading-7 text-white font-archivo font-medium">Search</span>
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </nav>
      </div>
    </div>
    <!-- Cart Widget -->
    <CartWidget v-if="isCartOpen" @close="closeCart" />
  </header>
</template>

<script>
import CartWidget from '../cart/CartWidget.vue'
import { useI18n } from 'vue-i18n'
// Removida a linha: import { getUnicode } from 'country-flag-icons/unicode'

export default {
  name: 'TheHeader',
  components: {
    CartWidget
  },
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  data() {
    return {
      isMobileMenuOpen: false,
      logoUrl: '/images/logo.png',
      isCartOpen: false,
      showEmailTooltip: false,
      showPhoneTooltip: false,
      selectedLanguage: 'FR',
      flagImages: {
        'EN': '/images/flags/US.svg',
        'FR': '/images/flags/FR.svg',
        'PT': '/images/flags/BR.svg'
      },
      isOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    handleImageError(e) {
      console.error('Error loading image:', e);
      e.target.src = 'https://via.placeholder.com/180x103?text=Logo';
      e.target.onerror = null;
    },
    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },
    closeCart() {
      this.isCartOpen = false
    },
    changeLanguage() {
      this.locale = this.selectedLanguage.toLowerCase()
    },
    getFlagImage(lang) {
      return this.flagImages[lang]
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang
      this.isOpen = false
      this.locale = lang.toLowerCase()
    }
  },
  watch: {
    selectedLanguage: {
      immediate: true,
      handler(newValue) {
        this.locale = newValue.toLowerCase()
      }
    }
  },
  mounted() {
    // Fecha o dropdown quando clicar fora dele
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown)
  }
}
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}

.text-empire-yellow {
  color: #FFDD00;
}

/* Adicione estes estilos para personalizar o select */
select:focus {
  outline: none;
}

/* Remove a borda padrão do select no Firefox */
select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #fff;
}

/* Estilo para as options no Chrome */
select option {
  background-color: #1E1E1E;
  color: white;
  padding: 8px;
}

/* Ajuste para o dropdown ficar mais largo e acomodar as bandeiras */
@media (min-width: 768px) {
  select {
    min-width: 80px;
  }
}

/* Versão mobile com apenas bandeiras */
@media (max-width: 767px) {
  select option {
    padding: 8px 24px;  /* Reduzido padding */
    min-height: 40px;   /* Reduzido min-height */
  }
}

/* Estilo para as bandeiras */
.flag-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Ajuste o padding-left do select para acomodar a bandeira */
select {
  padding-left: 2rem;
}

/* Adicione estes estilos */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>