<template>
  <footer class="flex flex-col items-center w-full">
    <div class="flex flex-row justify-center items-center py-12 md:py-[72px] px-4 md:px-[10px] w-full bg-empire-dark">
      <div class="flex flex-col justify-center items-start md:items-center gap-9 w-full max-w-content px-4">
        <div class="flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start gap-8 md:gap-20 w-full">
          <!-- Logo -->
          <div class="w-[200px] mb-4 md:mb-0">
            <img 
                :src="logoUrl"
                alt="Empire Logo" 
                class="w-[200px] h-[87.06px] object-contain"
                @error="handleImageError"
              >
          </div>

          <div class="flex flex-col md:flex-row gap-8 md:gap-20 w-full md:w-auto">
            <!-- Navigation Links -->
            <div class="w-full md:w-[120px]">
              <div class="flex flex-col gap-2">
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Home</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">History</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Suppliers</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Career</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Section -->
            <div class="w-full md:w-[157px]">
              <h3 class="font-archivo-narrow font-semibold text-heading leading-heading text-empire-yellow h-[40px] flex items-center">
                PRODUCTS
              </h3>
              <div class="flex flex-col gap-2">
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Plumbing</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Heating</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">Tools</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="w-full md:w-[437px]">
              <h3 class="font-archivo-narrow font-semibold text-heading leading-heading text-empire-yellow h-[40px] flex items-center">
                CONTACT US
              </h3>
              <div class="flex flex-col gap-2">
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="none">
                      <path d="M20 4v16H4V4h16m0-2H4C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="#FFDD00" stroke-width="2"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">514 745-1080</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#FFDD00">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">info@empirecanada.ca</span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#FFDD00">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">2320, rue Cohen, Saint-Laurent, QC H4R 2N8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="flex justify-center items-center w-full mt-8 md:mt-0">
          <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70 text-center">
            © Copyright Empire Canada 2025 | Tous Droits Réservés
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

 
<script>
export default {
  name: 'TheFooter',
  data() {
    return {
      logoUrl: '/images/logo.png'
    }
  },
  methods: {
    handleImageError(e) {
      console.error('Error loading image:', e);
      // Usa diretamente o placeholder se a imagem não for encontrada
      e.target.src = 'https://via.placeholder.com/200x87?text=Logo';
      e.target.onerror = null;
    }
  }
}
</script>