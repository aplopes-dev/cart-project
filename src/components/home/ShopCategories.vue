<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">SHOP BY CATEGORIES</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="category in categories" :key="category.id" class="relative group cursor-pointer">
          <div class="aspect-square overflow-hidden rounded-lg">
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 class="text-white text-xl font-semibold">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ShopCategories',
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Chairs',
          image: '/images/categories/category-chairs.jpg'
        },
        {
          id: 2,
          name: 'Tables',
          image: '/images/categories/category-tables.jpg'
        },
        {
          id: 3,
          name: 'Sofas',
          image: '/images/categories/category-sofas.jpg'
        },
        {
          id: 4,
          name: 'Beds',
          image: '/images/categories/category-beds.jpg',
          link: '/category/beds'
        }
      ]
    }
  }
}
</script>