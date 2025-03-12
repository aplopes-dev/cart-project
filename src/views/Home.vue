<template>
  <div>
    <HeroSection />
    <ShopCategories />
    <NewProducts />
    <div class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold mb-8">Featured Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id" class="group">
          <div class="relative overflow-hidden rounded-lg mb-4">
            <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="bg-white text-black px-6 py-2 rounded-full">
                Quick View
              </button>
            </div>
          </div>
          <h3 class="font-semibold mb-2">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroSection from '@/components/home/HeroSection.vue'
import ShopCategories from '@/components/home/ShopCategories.vue'
import NewProducts from '@/components/home/NewProducts.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    ShopCategories,
    NewProducts
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Product Name',
          price: '$99.99',
          image: 'https://via.placeholder.com/300x400'
        },
        // Adicione mais produtos aqui
      ]
    }
  }
}
</script>