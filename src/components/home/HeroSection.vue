<template>
  <section class="bg-gray-100">
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 class="text-5xl font-bold mb-6">Your Best Online Shop</h1>
          <p class="text-gray-600 text-lg mb-8">Discover our amazing collection of products with the best prices in the market.</p>
          <button class="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800">
            Shop Now
          </button>
        </div>
        <div class="relative">
          <img src="/images/hero-image.jpg" alt="Hero" class="rounded-lg shadow-xl">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>