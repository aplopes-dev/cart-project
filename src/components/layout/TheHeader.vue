<template>
  <header class="bg-white">
    <div class="container mx-auto px-4 py-6">
      <nav class="flex items-center justify-between">
        <!-- Logo e Menu Desktop -->
        <div class="flex items-center space-x-12">
          <a href="/" class="text-2xl font-bold">Logo</a>
          <!-- Menu Desktop -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Products</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
        
        <!-- Ícones da direita -->
        <div class="flex items-center">
          <!-- Botão Menu Mobile -->
          <button 
            class="md:hidden mr-4 p-2"
            @click="isMenuOpen = !isMenuOpen"
            aria-label="Menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                v-if="!isMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Ícones -->
          <div class="flex items-center space-x-4">
            <button class="p-2" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button class="p-2" aria-label="Profile">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button class="p-2 relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Menu Mobile -->
      <div 
        v-show="isMenuOpen" 
        class="md:hidden mt-4 py-4 border-t"
      >
        <div class="flex flex-col space-y-4">
          <a href="#" class="text-gray-600 hover:text-gray-900 px-2">Home</a>
          <a href="#" class="text-gray-600 hover:text-gray-900 px-2">Products</a>
          <a href="#" class="text-gray-600 hover:text-gray-900 px-2">About</a>
          <a href="#" class="text-gray-600 hover:text-gray-900 px-2">Contact</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      isMenuOpen: false
    }
  }
}
</script>