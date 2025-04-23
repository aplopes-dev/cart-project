<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-4 md:mb-8">
          <nav class="flex flex-wrap items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('systemSettings.categoryProduct') }}</span>
          </nav>
        </div>

        <!-- Título da Página -->
        <div class="mb-4 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-xl md:text-3xl">
            {{ $t('systemSettings.categoryProduct') }}
          </h1>
          <p class="text-black/70 font-archivo mt-2">
            {{ $t('systemSettings.categoryProductDescription') }}
          </p>
        </div>

        <!-- Filtros e Pesquisa -->
        <div class="mb-3 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
          <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('systemSettings.searchCategories')"
                class="w-full sm:w-64 p-2 border border-black/25 rounded font-archivo text-sm focus:outline-none focus:border-empire-yellow"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg class="w-4 h-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs md:text-sm font-archivo">{{ $t('systemSettings.showDisabled') }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="showDisabled" class="sr-only peer">
                <div class="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-empire-yellow"></div>
              </label>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs md:text-sm font-archivo">{{ $t('systemSettings.showOnlyWithProducts') }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="showOnlyWithProducts" class="sr-only peer">
                <div class="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-empire-yellow"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Lista de Categorias -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-12">
          <p class="text-black/70 font-archivo">{{ $t('systemSettings.noCategories') }}</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="category in categories" :key="category.id" class="bg-[#FAFAFA] p-3 md:p-6 rounded-lg">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 md:gap-4">
                <div class="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    :src="getCategoryImage(category.image, category)"
                    :alt="category.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <div>
                  <h3 class="font-archivo-narrow font-semibold text-sm md:text-lg">{{ category.name }}</h3>
                  <p class="text-black/70 font-archivo text-xs md:text-sm truncate max-w-[200px] md:max-w-md">
                    {{ category.description || $t('systemSettings.noDescription') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoryService } from '@/services/categoryService'
import { imageService } from '@/services/imageService'

export default {
  name: 'CategoryProductSettingsPageIntermediate',
  setup() {
    const { t } = useI18n()

    // Estado para categorias
    const categories = ref([])
    const loading = ref(true)
    const error = ref(null)
    const searchQuery = ref('')
    const showDisabled = ref(true)
    const showOnlyWithProducts = ref(true)

    // Carregar categorias
    const loadCategories = async () => {
      try {
        loading.value = true
        error.value = null

        // Buscar todas as categorias
        const allCategories = await categoryService.getAllCategories()
        categories.value = allCategories
      } catch (err) {
        console.error('Error loading categories:', err)
        error.value = t('systemSettings.errorLoadingCategories')
      } finally {
        loading.value = false
      }
    }

    // Tratamento de erro de imagem
    const handleImageError = (e) => {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    }

    // Obter URL da imagem da categoria
    const getCategoryImage = (imagePath, category) => {
      return imagePath || '/images/products/default.png'
    }

    // Carregar dados iniciais
    onMounted(() => {
      loadCategories()
    })

    return {
      categories,
      loading,
      error,
      searchQuery,
      showDisabled,
      showOnlyWithProducts,
      handleImageError,
      getCategoryImage
    }
  }
}
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>
