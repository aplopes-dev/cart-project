<template>
  <footer class="flex flex-col items-center w-full">
    <div class="flex flex-row justify-center items-center py-8 md:py-[72px] px-4 md:px-[10px] w-full bg-empire-dark">
      <div class="flex flex-col justify-center items-start md:items-center gap-6 md:gap-9 w-full max-w-content px-4">
        <div class="flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start gap-8 md:gap-20 w-full">
          <!-- Logo (apenas para desktop) -->
          <div class="hidden md:block w-[200px] mb-4 md:mb-0">
            <router-link to="/">
              <img
                :src="logoUrl"
                alt="Empire Logo"
                class="w-[200px] h-[87.06px] object-contain"
                @error="handleImageError"
              >
            </router-link>
          </div>

          <div class="flex flex-col md:flex-row gap-8 md:gap-28 w-full md:w-auto">
            <!-- Navigation Links -->
            <div class="w-full md:w-[120px]">
              <!-- Desktop Navigation (Column) -->
              <div class="hidden md:flex md:flex-col gap-2">
                <router-link to="/" class="flex items-center">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">{{ $t('footer.navigation.home') }}</span>
                  </div>
                </router-link>

                <router-link to="/history" class="flex items-center">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">{{ $t('footer.navigation.history') }}</span>
                  </div>
                </router-link>

                <router-link to="/suppliers" class="flex items-center">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">{{ $t('footer.navigation.suppliers') }}</span>
                  </div>
                </router-link>

                <router-link to="/career" class="flex items-center">
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[160px]">
                    <span class="font-archivo font-normal text-nav leading-nav text-empire-white-70">{{ $t('footer.navigation.career') }}</span>
                  </div>
                </router-link>
              </div>

              <!-- Mobile Navigation (2x2 Grid) -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 md:hidden">
                <!-- Primeira coluna -->
                <div class="flex flex-col gap-2">
                  <!-- Início -->
                  <router-link to="/" class="flex items-center">
                    <div class="w-[30px]">
                      <svg class="w-5 h-5 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-30px)]">
                      <span class="font-archivo font-normal text-sm leading-5 text-empire-white-70">{{ $t('footer.navigation.home') }}</span>
                    </div>
                  </router-link>

                  <!-- Fornecedores -->
                  <router-link to="/suppliers" class="flex items-center">
                    <div class="w-[30px]">
                      <svg class="w-5 h-5 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-30px)]">
                      <span class="font-archivo font-normal text-sm leading-5 text-empire-white-70">{{ $t('footer.navigation.suppliers') }}</span>
                    </div>
                  </router-link>
                </div>

                <!-- Segunda coluna -->
                <div class="flex flex-col gap-2">
                  <!-- História -->
                  <router-link to="/history" class="flex items-center">
                    <div class="w-[30px]">
                      <svg class="w-5 h-5 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-30px)]">
                      <span class="font-archivo font-normal text-sm leading-5 text-empire-white-70">{{ $t('footer.navigation.history') }}</span>
                    </div>
                  </router-link>

                  <!-- Carreira -->
                  <router-link to="/career" class="flex items-center">
                    <div class="w-[30px]">
                      <svg class="w-5 h-5 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-30px)]">
                      <span class="font-archivo font-normal text-sm leading-5 text-empire-white-70">{{ $t('footer.navigation.career') }}</span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Products and Contact Sections Container -->
            <div class="flex flex-row gap-4 md:gap-20 w-full">
              <!-- Products Section -->
              <div class="w-1/2 md:w-[200px]">
                <h3 class="font-archivo-narrow font-semibold text-sm md:text-[24px] leading-5 md:leading-[30px] text-empire-yellow h-[24px] md:h-[30px] flex items-center">
                  {{ $t('footer.titles.products') }}
                </h3>
                <div class="flex flex-col gap-2 mt-2 md:mt-4">
                  <div
                    v-for="category in categories"
                    :key="category.id"
                    class="flex"
                    @click="navigateToCategory(category.id)"
                    style="cursor: pointer;"
                  >
                    <div class="w-[20px] md:w-[40px]">
                      <svg class="w-3 h-3 md:w-6 md:h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-20px)] md:w-[160px] overflow-hidden">
                      <span
                        class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70 whitespace-nowrap overflow-hidden truncate block"
                        :title="category.name"
                      >
                        {{ $filters.formatCategoryName(category.name).length > 20 ? $filters.formatCategoryName(category.name).substring(0, 20) + '...' : $filters.formatCategoryName(category.name) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Section -->
              <div class="w-1/2 md:w-[200px]">
                <h3 class="font-archivo-narrow font-semibold text-sm md:text-[24px] leading-5 md:leading-[30px] text-empire-yellow h-[24px] md:h-[30px] flex items-center">
                  {{ $t('footer.titles.contactUs') }}
                </h3>
                <div class="flex flex-col gap-0.5 md:gap-2 mt-2 md:mt-4">
                  <!-- Telefone -->
                  <div class="flex items-center">
                    <div class="w-[20px] md:w-[24px] flex items-center">
                      <svg class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M20 4v16H4V4h16m0-2H4C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="#FFDD00" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-20px)] md:w-[176px] pl-2">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.phone }}
                      </span>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="flex items-center">
                    <div class="w-[20px] md:w-[24px] flex items-center">
                      <svg class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 24 24" fill="#FFDD00">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-20px)] md:w-[176px] pl-2">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.email }}
                      </span>
                    </div>
                  </div>

                  <!-- Endereço -->
                  <div class="flex items-center">
                    <div class="w-[20px] md:w-[24px] flex items-center">
                      <svg class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 24 24" fill="#FFDD00">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div class="w-[calc(100%-20px)] md:w-[176px] pl-2">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.address }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Logo (apenas para mobile) -->
                <div class="flex md:hidden justify-start items-center w-full mt-8 pt-2 border-t border-[rgba(78,78,78,0.35)]">
                  <router-link to="/" class="w-[160px]">
                    <img
                      :src="logoUrl"
                      alt="Empire Logo"
                      class="w-[160px] h-[70px] object-contain"
                      @error="handleImageError"
                    >
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="flex justify-center items-center w-full mt-4 md:mt-0">
          <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70 text-center">
            © Copyright {{ companyData.name }} {{ new Date().getFullYear() }} | {{ $t('footer.allRightsReserved') }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryService } from '@/services/categoryService'
import { logoService } from '@/services/logoService'
import { imageService } from '@/services/imageService'
import api from '@/services/api'
import eventBus from '@/utils/eventBus'
import { formatCategoryName } from '@/filters'

const router = useRouter()
const logoUrl = ref('/images/logo/logo.png')
const categories = ref([])
const companyData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const handleImageError = (e) => {
  console.error('Error loading image:', e)
  // Usa a função utilitária do imageService para lidar com erros de imagem
  imageService.handleImageError(e)
}

const navigateToCategory = (categoryId) => {
  router.push(`/categories/${categoryId}`)
}

const loadCategories = async () => {
  try {
    console.log('[Footer] Iniciando carregamento de categorias')

    // Buscar todas as categorias
    const allCategories = await categoryService.getCategories()
    console.log(`[Footer] Recebidas ${allCategories.length} categorias da API`)

    // Buscar contagem de produtos por categoria
    const topCategories = await categoryService.getTopCategoriesWithMostProducts(100)
    console.log(`[Footer] Recebidas ${topCategories.length} categorias com contagem de produtos`)

    // Criar um mapa de contagem de produtos por categoria
    const productCountMap = {}
    topCategories.forEach(category => {
      productCountMap[category.id] = category.productCount
    })

    // Construir a árvore de categorias
    const categoryTree = categoryService.buildCategoryTree(allCategories)

    // Filtrar categorias sem produtos
    const filteredCategoryTree = categoryService.filterCategoryTree(categoryTree, productCountMap)

    // Extrair todas as categorias da árvore filtrada (incluindo subcategorias)
    const extractAllCategories = (tree, result = []) => {
      tree.forEach(category => {
        result.push(category)
        if (category.children && category.children.length > 0) {
          extractAllCategories(category.children, result)
        }
      })
      return result
    }

    const allFilteredCategories = extractAllCategories(filteredCategoryTree)
    console.log(`[Footer] Total de categorias filtradas: ${allFilteredCategories.length}`)

    // Ordenar por quantidade de produtos (decrescente) e pegar as 10 primeiras
    categories.value = allFilteredCategories
      .sort((a, b) => (productCountMap[b.id] || 0) - (productCountMap[a.id] || 0))
      .slice(0, 10)

    console.log(`[Footer] Exibindo as 10 categorias com mais produtos: ${categories.value.map(c => `${c.name} (formatado: ${formatCategoryName(c.name)})`).join(', ')}`)
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  }
}

const loadCompanyData = async () => {
  try {
    const response = await api.get('/settings/company')
    companyData.value = {
      name: response.data.company_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      address: response.data.address || ''
    }
    console.log('Company data updated:', companyData.value) // Debug log
  } catch (err) {
    console.error('Error loading company data:', err)
  }
}

// Função para carregar a logo ativa
const loadActiveLogo = async () => {
  try {
    const logo = await logoService.getActiveLogo()
    if (logo && logo.image_url) {
      logoUrl.value = logo.image_url
      console.log('[Footer] Active logo loaded:', logo.name)
    }
  } catch (error) {
    console.error('Error loading active logo:', error)
    // Mantém a logo padrão em caso de erro
  }
}

// Event handler
const updateCompanyDataHandler = async () => {
  console.log('Company data update event received') // Debug log
  await loadCompanyData()
}

onMounted(() => {
  loadCategories()
  loadCompanyData()
  loadActiveLogo()
  eventBus.on('company-data-updated', updateCompanyDataHandler)
})

onUnmounted(() => {
  eventBus.off('company-data-updated', updateCompanyDataHandler)
})
</script>





