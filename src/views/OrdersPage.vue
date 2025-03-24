<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('orders.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('orders.title') }}
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!orders.length" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 17h6M9 13h6M3 8h18v13H3V8zM3 8l2-4h14l2 4"/>
          </svg>
          <p class="text-xl font-archivo mb-4">{{ $t('orders.noOrders') }}</p>
          <router-link 
            to="/categories" 
            class="inline-block bg-empire-yellow text-black font-archivo font-semibold py-3 px-6 rounded hover:bg-yellow-400 transition-colors"
          >
            {{ $t('orders.startShopping') }}
          </router-link>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-6">
          <div v-for="order in orders" :key="order.id" class="border-2 border-black/10 rounded-lg p-6">
            <div 
              class="flex flex-wrap justify-between items-start gap-4 mb-4 cursor-pointer"
              @click="toggleOrder(order.id)"
            >
              <div>
                <h3 class="font-archivo-narrow font-semibold text-xl mb-1">
                  {{ $t('orders.orderNumber', { number: order.order_number }) }}
                </h3>
                <p class="text-black/60 font-archivo">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>
              <div class="text-right">
                <p v-if="!isOrderExpanded(order.id)" class="font-archivo-narrow font-semibold text-xl">
                  {{ formatPrice(order.total) }}
                </p>
                <span :class="getStatusClass(order.status.toLowerCase())" class="inline-block px-3 py-1 rounded-full text-sm">
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="isOrderExpanded(order.id)">
              <div class="mt-4 border-t border-black/10 pt-4">
                <div v-for="item in order.items" :key="item.product_id" class="flex items-center justify-between space-x-4">
                  <div class="flex items-center gap-8 w-full">
                    <div class="flex items-center gap-4 min-w-[400px] max-w-[400px]">
                      <img 
                        :src="item.image" 
                        :alt="item.product_name"
                        @error="handleImageError"
                        class="w-16 h-16 object-cover rounded shrink-0"
                      />
                      
                      <router-link 
                        v-if="item.product_id"
                        :to="`/product/${item.product_id}`"
                        class="hover:text-empire-yellow transition-colors truncate"
                      >
                        {{ item.product_name }}
                      </router-link>
                      <span v-else class="truncate">{{ item.product_name }}</span>
                    </div>
                    
                    <p class="text-sm text-black/60 w-[200px] shrink-0">
                      {{ $t('orders.quantity') }}: {{ item.quantity }} x {{ formatPrice(item.unit_price) }}
                    </p>
                  </div>
                  
                  <p class="font-archivo-narrow font-semibold text-right w-[120px] shrink-0">
                    {{ formatPrice(item.total_price) }}
                  </p>
                </div>
              </div>

              <!-- Sumário do pedido -->
              <div class="border-t border-black/10 mt-6 pt-4">
                <div class="flex flex-col gap-2 items-end">
                  <div class="flex justify-end gap-8 w-full">
                    <span class="font-archivo text-black/70">{{ $t('orders.shipping') }}</span>
                    <span class="font-archivo w-[120px] text-right">
                      {{ formatPrice(order.shipping_cost) }}
                    </span>
                  </div>
                  
                  <div class="flex justify-end gap-8 w-full">
                    <span class="font-archivo text-black/70">{{ $t('orders.taxes') }}</span>
                    <span class="font-archivo w-[120px] text-right">
                      {{ formatPrice(order.tax) }}
                    </span>
                  </div>

                  <div class="flex justify-end gap-8 w-full pt-2 border-t border-black/10">
                    <span class="font-archivo-narrow font-semibold text-xl">{{ $t('orders.total') }}</span>
                    <span class="font-archivo-narrow font-semibold text-xl w-[120px] text-right">
                      {{ formatPrice(order.total) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div class="flex flex-col items-center mt-12 mb-24 w-full gap-4">
          <div class="flex justify-center items-center gap-2 md:gap-4 w-full">
            <!-- Botão Previous -->
            <button 
              class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.previous') }}</span>
            </button>

            <!-- Números das Páginas -->
            <div class="flex gap-1 md:gap-2">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm md:text-base"
                :class="page === currentPage ? 'bg-black text-white' : 'bg-[#F9F9FB] text-black'"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <!-- Botão Next -->
            <button 
              class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.next') }}</span>
              <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Contador de Items na paginação -->
          <div class="flex justify-center">
            <span class="font-inter text-sm md:text-base">
              {{ totalItems === 0 
                ? $t('categoryPage.noResults') 
                : $t('categoryPage.itemsCount', { 
                    start: itemRange.start, 
                    end: itemRange.end, 
                    total: totalItems 
                  }) 
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

// Definindo a constante diretamente como é feito em outros componentes
const PLACEHOLDER_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 5
const expandedOrders = ref([]) // Adicionado ref para controlar as orders expandidas

// Computed para páginas a serem exibidas
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Computed property para calcular o intervalo de itens
const itemRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, totalItems.value)
  return { start, end }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const toggleOrder = (orderId) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index === -1) {
    expandedOrders.value.push(orderId)
  } else {
    expandedOrders.value.splice(index, 1)
  }
}

const isOrderExpanded = (orderId) => {
  return expandedOrders.value.includes(orderId)
}

const fetchOrders = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get(`/orders`, {
      params: {
        page,
        limit: itemsPerPage
      }
    })
    
    // Transformando os dados para incluir o status em caixa alta
    orders.value = response.data.items.map(order => ({
      ...order,
      status: order.status.toUpperCase()
    }))
    currentPage.value = response.data.page
    totalPages.value = response.data.totalPages
    totalItems.value = response.data.total // Adicione esta linha para obter o total de itens
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = 'Error fetching orders'
  } finally {
    loading.value = false
  }
}

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    await fetchOrders(page)
    // Opcional: Rolar para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchOrders()
})

const handleImageError = (e) => {
  e.target.src = PLACEHOLDER_IMAGE_BASE64
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
























