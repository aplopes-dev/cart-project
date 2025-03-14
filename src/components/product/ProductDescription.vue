<template>
  <div class="flex flex-col items-center py-0 gap-4 w-full max-w-[1130px]">
    <!-- Description Section -->
    <div class="flex flex-col items-start w-full bg-white border border-[#FAFAFA] rotate-[0.21deg]">
      <h2 class="w-full font-archivo-narrow font-semibold text-[36px] leading-[56px] text-black">
        DESCRIPTION
      </h2>
      
      <p class="w-full font-archivo font-medium text-[22px] leading-[33px] text-black/70">
        No more frantic treks to the hardware shop. Our product is made with high-quality steel, and the high-polish chrome finish gives strength, durability, and corrosion resistance. No matter how tough your work is, the tools are incredibly resilient. Perfect for repairmen, construction workers, handymen, body shops, mechanics, etc. a terrific tool to have at home, in the garage, and in the workshop. Each tool complies with ANSI requirements...
      </p>
    </div>

    <!-- Best Sellers Section -->
    <div class="flex flex-col justify-center items-start w-full">
      <!-- Título com mesmo estilo do DESCRIPTION -->
      <div class="w-full border-b border-black/25 mb-8">
        <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-[40px] py-4">
          BEST SELLERS
        </h2>
      </div>

      <!-- Grid container com scroll horizontal no mobile -->
      <div class="w-full overflow-x-auto pb-4 -mx-4 md:mx-0">
        <div class="flex md:grid md:grid-cols-3 gap-4 px-4 md:px-0 min-w-max md:min-w-0">
          <!-- Product Cards -->
          <div 
            v-for="i in 3" 
            :key="i" 
            class="w-[280px] md:w-auto flex flex-col justify-center items-center bg-white border border-[#FAFAFA]"
          >
            <img 
              src="/img/product1.png" 
              alt="Product" 
              class="w-full max-w-[280px] md:max-w-[307px] h-[240px] md:h-[282px] object-cover" 
            />
            
            <div class="flex flex-col items-start gap-4 w-full p-4">
              <div class="flex flex-col gap-2 md:gap-4">
                <h3 class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[32px] md:leading-[40px] text-black/70 text-center w-full">
                  LOREM IPSUM
                </h3>
                <p class="font-archivo font-medium text-[16px] md:text-[20px] leading-[18px] md:leading-[22px] text-black/70 text-center w-full">
                  Lorem ipsum dolor sit amet dorim...
                </p>
              </div>

              <div class="w-full text-center mb-4">
                <p class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[32px] md:leading-[40px]">
                  R$ 199,99
                </p>
              </div>

              <!-- Botão ADD CART -->
              <button class="w-full h-[73.31px] bg-black">
                <span class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-[#FFDD00]">ADD CART</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDescription'
}
</script>
<style scoped>
/* Esconde a scrollbar mas mantém a funcionalidade */
.overflow-x-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
