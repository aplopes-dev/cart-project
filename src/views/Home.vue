<template>
  <div>
    <HeroSection />
    <NewProducts />
    <ShopCategories />
    <BrandLogos />
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import ShopCategories from '@/components/home/ShopCategories.vue' // Updated path
import NewProducts from '@/components/home/NewProducts.vue'
import BrandLogos from '@/components/home/BrandLogos.vue'
</script>

<style>
/* Seus estilos aqui, se necessário */
</style>
