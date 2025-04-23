<template>
  <div class="home-container">
    <HeroSection />
    <div class="section-wrapper hero-products-gap">
      <NewProducts />
    </div>
    <div class="section-wrapper">
      <ShopCategories />
    </div>
    <div class="section-wrapper">
      <BrandLogos />
    </div>
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
/* Estilos para controlar os espaçamentos entre as seções */
.home-container {
  display: flex;
  flex-direction: column;
}

.section-wrapper {
  margin-top: -40px; /* Espaçamento negativo para aproximar as seções no mobile */
}

/* Espaçamento especial entre HeroSection e NewProducts */
.hero-products-gap {
  margin-top: 20px; /* Espaçamento positivo para separar HeroSection e NewProducts no mobile */
}

@media (min-width: 768px) {
  .section-wrapper {
    margin-top: 0; /* Restaura o espaçamento normal no desktop */
  }

  /* No desktop, não precisamos de espaçamento especial */
  .hero-products-gap {
    margin-top: 0;
  }
}
</style>
