<template>
  <section v-if="brands.length > 0" class="flex flex-col items-center py-12 md:py-24 px-4 md:px-6 gap-4 md:gap-6 w-full bg-[#FAFAFA]">
    <!-- Container com scroll horizontal no mobile -->
    <div class="w-full max-w-[1146px] overflow-x-auto scrollbar-hide">
      <div class="flex justify-start md:justify-center items-start gap-4 md:gap-9 min-w-max md:min-w-0">
        <div v-if="loading" class="flex justify-center items-center w-full py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-empire-yellow"></div>
        </div>
        <template v-else>
          <div v-if="brands.length === 0" class="text-center py-8 text-gray-500">
            {{ $t('brand.noBrands') }}
          </div>
          <template v-else>
            <div
              v-for="brand in brands"
              :key="brand.id"
              class="flex items-center justify-center"
            >
              <img
                :src="brand.logo || '/images/brands/default.png'"
                :alt="brand.name"
                :title="brand.name"
                class="w-[120px] md:w-[167px] h-16 md:h-24 object-contain flex-shrink-0"
                @error="handleImageError"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { brandService } from '@/services/brandService'

export default {
  name: 'BrandLogos',
  setup() {
    const brands = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchBrands = async () => {
      try {
        loading.value = true
        error.value = null
        // Buscar apenas marcas ativas
        const data = await brandService.getBrands(true)
        brands.value = data
      } catch (err) {
        console.error('Error fetching brands:', err)
        error.value = err.message || 'Erro ao carregar marcas'
      } finally {
        loading.value = false
      }
    }

    const handleImageError = (e) => {
      e.target.src = '/images/brands/default.png'
    }

    onMounted(() => {
      fetchBrands()
    })

    return {
      brands,
      loading,
      error,
      handleImageError
    }
  }
}
</script>
<style scoped>
/* Esconde a scrollbar mas mantém a funcionalidade */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
