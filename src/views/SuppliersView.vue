<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">{{ $t('suppliers.title') }}</h1>

      <div class="space-y-8">
        <div v-for="supplier in suppliers" :key="supplier.name" class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ supplier.name }}</h2>
          <p class="text-black">{{ supplier.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuppliersView',
  data() {
    return {
      suppliers: [
        {
          name: 'Quality Plumbing Co.',
          description: this.$t('suppliers.supplier1')
        },
        {
          name: 'HeatingTech Solutions',
          description: this.$t('suppliers.supplier2')
        },
        {
          name: 'ToolMaster Pro',
          description: this.$t('suppliers.supplier3')
        },
        {
          name: 'PipeWorks International',
          description: this.$t('suppliers.supplier4')
        }
      ]
    }
  }
}
</script>