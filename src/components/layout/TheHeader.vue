<template>
  <header class="relative w-full">
    <!-- Background Image with Overlay -->
    <div class="absolute w-full h-[846px] left-0 top-[-2px]">
      <div class="w-full h-full bg-gradient-to-b from-black/25 to-black/25 bg-cover bg-center"
           style="background-image: url('@/assets/header-bg.png');">
      </div>
    </div>

    <!-- Top Navigation -->
    <div class="relative flex flex-col items-center px-4 py-3 w-full bg-[rgba(3,3,3,0.7)]">
      <!-- Upper Section -->
      <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-4 py-3">
        <!-- Logo -->
        <img src="@/assets/logo.png" alt="Logo" class="w-[180px] h-[103.28px] mb-4 md:mb-0">

        <!-- Contact Information -->
        <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <!-- Email Section -->
          <div class="flex items-center gap-4">
            <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-full">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-[15px] leading-7 text-empire-yellow font-archivo font-medium">Chat with us</span>
              <span class="text-[19px] leading-7 text-white font-archivo font-bold">mail@mail.com.br</span>
            </div>
          </div>

          <!-- Phone Section -->
          <div class="flex items-center gap-4">
            <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-full">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-[15px] leading-7 text-empire-yellow font-archivo font-medium">Call us today</span>
              <span class="text-[19px] leading-7 text-white font-archivo font-bold">+00123456789</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lower Section -->
      <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-4 py-3 border-t border-[rgba(78,78,78,0.35)]">
        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 mb-4 md:mb-0">
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">Home</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">History</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">Suppliers</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1">
            Shop
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#FBBD1E">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">Career</a>
          <a href="#" class="text-[15px] leading-7 text-white font-archivo font-medium">Contact us</a>
        </nav>

        <!-- Right Section -->
        <div class="flex flex-wrap justify-center items-center gap-4">
          <!-- Language -->
          <span class="text-[15px] leading-7 text-white font-archivo font-medium">FR</span>

          <!-- Cart and Sign In -->
          <div class="flex items-center gap-6">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="text-[15px] leading-7 text-white font-archivo font-medium">Sign in</span>
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
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeader'
}
</script>