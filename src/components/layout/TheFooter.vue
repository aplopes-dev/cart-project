<template>
  <footer class="flex flex-col items-center w-full">
    <div class="flex flex-row justify-center items-center py-4 md:py-12 px-4 md:px-[10px] w-full bg-empire-dark">
      <div class="flex flex-col justify-center items-start md:items-center gap-3 md:gap-9 w-full max-w-content px-4">
        <!-- Logo e Links de Navegação -->
        <div class="flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start gap-3 md:gap-20 w-full">
          <!-- Logo -->
          <div class="w-[100px] md:w-[200px] mb-2 md:mb-0">
            <router-link to="/">
              <img
                :src="logoUrl"
                alt="Empire Logo"
                class="w-[100px] md:w-[200px] h-auto md:h-[87.06px] object-contain"
                @error="handleImageError"
              >
            </router-link>
          </div>

          <div class="flex flex-col md:flex-row gap-3 md:gap-20 w-full md:w-auto">
            <!-- Navigation Links -->
            <div class="w-full md:w-[120px]">
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
                <router-link to="/" class="flex items-center">
                  <div class="w-[24px] md:w-[40px]">
                    <svg class="w-3 h-3 md:w-6 md:h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[100px] md:w-[160px]">
                    <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                      {{ $t('footer.navigation.home') }}
                    </span>
                  </div>
                </router-link>

                <router-link to="/history" class="flex items-center">
                  <div class="w-[24px] md:w-[40px]">
                    <svg class="w-3 h-3 md:w-6 md:h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[100px] md:w-[160px]">
                    <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                      {{ $t('footer.navigation.history') }}
                    </span>
                  </div>
                </router-link>

                <router-link to="/suppliers" class="flex items-center">
                  <div class="w-[24px] md:w-[40px]">
                    <svg class="w-3 h-3 md:w-6 md:h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[100px] md:w-[160px]">
                    <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                      {{ $t('footer.navigation.suppliers') }}
                    </span>
                  </div>
                </router-link>

                <router-link to="/career" class="flex items-center">
                  <div class="w-[24px] md:w-[40px]">
                    <svg class="w-3 h-3 md:w-6 md:h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[100px] md:w-[160px]">
                    <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                      {{ $t('footer.navigation.career') }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Products Section -->
            <div class="w-full md:w-[240px]">
              <h3 class="font-archivo-narrow font-semibold text-heading leading-heading text-empire-yellow h-[40px] flex items-center">
                {{ $t('footer.titles.products') }}
              </h3>
              <div class="flex flex-col gap-2">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="flex"
                  @click="navigateToCategory(category.id)"
                  style="cursor: pointer;"
                >
                  <div class="w-[40px]">
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                  <div class="w-[200px] overflow-hidden">
                    <span
                      class="font-archivo font-normal text-nav leading-nav text-empire-white-70 whitespace-nowrap overflow-hidden truncate block"
                      :title="category.name"
                    >
                      {{ category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Contact Section -->
              <div class="w-full md:w-[437px]">
                <h3 class="font-archivo-narrow font-semibold text-sm md:text-heading leading-5 md:leading-heading text-empire-yellow h-[24px] md:h-[40px] flex items-center">
                  {{ $t('footer.titles.contactUs') }}
                </h3>
                <div class="flex flex-col gap-0.5 md:gap-2">
                  <!-- Telefone -->
                  <div class="flex md:block items-center md:items-start">
                    <div class="w-[24px] md:w-[40px] flex items-center md:block">
                      <svg class="w-3 h-3 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                        <path d="M20 4v16H4V4h16m0-2H4C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="#FFDD00" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="w-[100px] md:w-[160px]">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.phone }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div class="flex md:block items-center md:items-start">
                    <div class="w-[24px] md:w-[40px] flex items-center md:block">
                      <svg class="w-3 h-3 md:w-6 md:h-6" viewBox="0 0 24 24" fill="#FFDD00">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div class="w-[100px] md:w-[160px]">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.email }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Endereço -->
                  <div class="flex md:block items-center md:items-start">
                    <div class="w-[24px] md:w-[40px] flex items-center md:block">
                      <svg class="w-3 h-3 md:w-6 md:h-6" viewBox="0 0 24 24" fill="#FFDD00">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div class="w-[100px] md:w-[160px]">
                      <span class="font-archivo font-normal text-xs md:text-nav leading-4 md:leading-nav text-empire-white-70">
                        {{ companyData.address }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="flex justify-center items-center w-full mt-2 md:mt-8">
          <span class="font-archivo font-normal text-[10px] md:text-nav leading-3 md:leading-nav text-empire-white-70 text-center">
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
import api from '@/services/api'
import eventBus from '@/utils/eventBus'

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
  e.target.src = 'https://via.placeholder.com/200x87?text=Logo'
  e.target.onerror = null
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

    console.log(`[Footer] Exibindo as 10 categorias com mais produtos: ${categories.value.map(c => c.name).join(', ')}`)
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

// Event handler
const updateCompanyDataHandler = async () => {
  console.log('Company data update event received') // Debug log
  await loadCompanyData()
}

onMounted(() => {
  loadCategories()
  loadCompanyData()
  eventBus.on('company-data-updated', updateCompanyDataHandler)
})

onUnmounted(() => {
  eventBus.off('company-data-updated', updateCompanyDataHandler)
})
</script>





