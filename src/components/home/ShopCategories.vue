<template>
  <section class="flex flex-col items-center py-24 px-6 gap-6 w-full bg-white">
    <div class="flex flex-col items-center gap-6 max-w-[1346px]">
      <!-- Title -->
      <h2 class="w-full text-[45px] leading-[72px] font-semibold font-archivo-narrow text-center text-black/70">
        {{ $t('categories.shopByCategories') }}
      </h2>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <!-- Category Card - Plumbing -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory('plumbing')">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M54 28h-2v-8c0-1.1-.9-2-2-2h-4v-2c0-1.1-.9-2-2-2h-8V6c0-1.1-.9-2-2-2H16c-1.1 0-2 .9-2 2v26H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h48c1.1 0 2-.9 2-2V30c0-1.1-.9-2-2-2zM16 8h16v8H16V8zm0 12h16v8H16v-8zm-6 38V34h44v24H10z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[34px] font-archivo-narrow font-semibold text-[#FFDD00]">PLUMBING</span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="item in plumbingItems" :key="item" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-xl text-black/70">{{ item }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img 
                  :src="plumbingImage" 
                  alt="Plumbing Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Category Card - Tools -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory('tools')">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M56 16L48 8l-8 8-6-6-4 4 6 6-20 20-6-6-4 4 6 6-8 8 8 8 8-8 6 6 4-4-6-6 20-20 6 6 4-4-6-6 8-8zm-28 28L16 32l20-20 12 12-20 20z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[34px] font-archivo-narrow font-semibold text-[#FFDD00]">TOOLS</span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="item in toolsItems" :key="item" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-xl text-black/70">{{ item }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img 
                  :src="toolsImage" 
                  alt="Tools Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Category Card - Heating -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory('heating')">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 50c-12.15 0-22-9.85-22-22s9.85-22 22-22 22 9.85 22 22-9.85 22-22 22zm0-38c-8.84 0-16 7.16-16 16s7.16 16 16 16 16-7.16 16-16-7.16-16-16-16z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[34px] font-archivo-narrow font-semibold text-[#FFDD00]">HEATING</span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="item in heatingItems" :key="item" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-xl text-black/70">{{ item }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img 
                  :src="heatingImage" 
                  alt="Heating Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const plumbingImage = '/images/categories/plumbing.png'
const toolsImage = '/images/categories/tools.png'
const heatingImage = '/images/categories/heating.png'

const plumbingItems = [
  'Pipe Fittings',
  'Valves & Controls',
  'Drainage Systems',
  'Water Heaters',
  'Bathroom Fixtures'
];

const toolsItems = [
  'Hand Tools',
  'Power Tools',
  'Measuring Tools',
  'Safety Equipment',
  'Tool Storage'
];

const heatingItems = [
  'Radiators',
  'Boilers',
  'Thermostats',
  'Heat Pumps',
  'Underfloor Heating'
];

const navigateToCategory = (slug) => {
  router.push(`/categories/${slug}`);
};
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>
