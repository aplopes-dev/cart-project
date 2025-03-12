<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">NEW PRODUCTS</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in newProducts" :key="product.id" class="bg-white p-4 rounded-lg group">
          <div class="relative aspect-square mb-4 overflow-hidden rounded-lg">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover"
            >
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex gap-2">
                <button class="p-2 bg-white rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button class="p-2 bg-white rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="text-center">
            <h3 class="font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-gray-600">${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NewProducts',
  data() {
    return {
      newProducts: [
        {
          id: 1,
          name: 'Modern Chair',
          price: '199.99',
          image: '/images/products/chair-1.jpg'
        },
        {
          id: 2,
          name: 'Elegant Sofa',
          price: '599.99',
          image: '/images/products/sofa-1.jpg'
        },
        {
          id: 3,
          name: 'Dining Table',
          price: '399.99',
          image: '/images/products/table-1.jpg'
        },
        {
          id: 4,
          name: 'Bed Frame',
          price: '799.99',
          image: '/images/products/bed-1.jpg'
        }
      ]
    }
  }
}
</script>