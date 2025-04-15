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
                <p v-if="!isOrderExpanded(order.id) && !isOrderWithoutPrices(order)" class="font-archivo-narrow font-semibold text-xl">
                  {{ formatPrice(calculateOrderTotal(order)) }}
                </p>
                <p v-if="!isOrderExpanded(order.id) && isOrderWithoutPrices(order)" class="font-archivo-narrow font-semibold text-xl text-gray-500">
                  {{ $t('orders.noPriceOrder') }}
                </p>
                <span :class="getStatusClass(order.status.toLowerCase())" class="inline-block px-3 py-1 rounded-full text-sm">
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="isOrderExpanded(order.id)">
              <div class="mt-4 border-t border-black/10 pt-4">
                <div v-for="item in order.items" :key="item.product_id" class="flex items-start sm:items-center gap-4 w-full">
                  <!-- Container principal do produto -->
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <!-- Imagem do produto -->
                    <div class="shrink-0">
                      <router-link
                        v-if="item.product_id"
                        :to="`/product/${item.product_id}`"
                        class="block"
                      >
                        <img
                          :src="item.image || PLACEHOLDER_IMAGE_PATH"
                          :alt="item.product_name"
                          @error="handleImageError"
                          class="w-16 h-16 object-cover rounded"
                        />
                      </router-link>
                      <img
                        v-else
                        :src="item.image || PLACEHOLDER_IMAGE_PATH"
                        :alt="item.product_name"
                        @error="handleImageError"
                        class="w-16 h-16 object-cover rounded shrink-0"
                      />
                    </div>

                    <!-- Container do nome e quantidade -->
                    <div class="flex flex-col sm:flex-row items-start gap-2 min-w-0 flex-1">
                      <!-- Nome do produto - centralizado verticalmente com a imagem -->
                      <div class="min-w-0 sm:w-[250px] flex flex-col justify-center h-16">  <!-- h-16 para igualar a altura da imagem -->
                        <router-link
                          v-if="item.product_id"
                          :to="`/product/${item.product_id}`"
                          class="hover:text-empire-yellow transition-colors text-base sm:text-lg block truncate"
                        >
                          {{ item.product_name }}
                        </router-link>
                        <span v-else class="text-base sm:text-lg block truncate">{{ item.product_name }}</span>

                        <!-- Características do produto -->
                        <div v-if="item.color || item.size || item.weight" class="flex flex-wrap gap-x-3 mt-1">
                          <span v-if="item.color" class="text-xs text-gray-600 flex items-center gap-1">
                            <span class="font-semibold">{{ $t('productDetails.selectColor') }}:</span>
                            <span class="flex items-center gap-1">
                              <ColorCircle :color="item.color" :size="12" />
                            </span>
                          </span>
                          <span v-if="item.size" class="text-xs text-gray-600">
                            <span class="font-semibold">{{ $t('productDetails.selectSize') }}:</span> {{ item.size }}
                          </span>
                          <span v-if="item.weight" class="text-xs text-gray-600">
                            <span class="font-semibold">{{ $t('productDetails.selectWeight') }}:</span> {{ item.weight }}
                          </span>
                        </div>
                      </div>

                      <!-- Quantidade e preço unitário -->
                      <div class="flex items-center gap-1 font-archivo text-xs sm:text-base whitespace-nowrap sm:mx-auto sm:pt-4">
                        <div class="flex items-center justify-center bg-black/5 px-2 sm:px-3 py-1 rounded">
                          <!-- Quando tem preço, mostra quantidade, x, preço -->
                          <template v-if="!isOrderWithoutPrices(order)">
                            <span class="font-semibold">{{ item.quantity }}</span>
                            <span class="mx-1 sm:mx-2 text-black/60">x</span>
                            <span class="sm:text-sm">{{ formatPrice(item.unit_price) }}</span>
                          </template>
                          <!-- Quando não tem preço, mostra quantidade, x -->
                          <template v-else>
                            <span class="font-semibold">{{ item.quantity }}</span>
                            <span class="mx-1 sm:mx-2 text-black/60">x</span>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Preço total com largura fixa (exibido apenas se o pedido tiver preços) -->
                  <div v-if="!isOrderWithoutPrices(order)" class="w-[80px] sm:w-[120px] flex-shrink-0 text-right sm:self-center">
                    <p class="font-archivo-narrow font-semibold text-sm sm:text-xl">
                      {{ formatPrice(item.total_price) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sumário do pedido -->
              <div class="border-t border-black/10 mt-6 pt-4">
                <div class="flex flex-wrap justify-between">
                  <!-- Informações do pedido: Notas e Endereço -->
                  <div class="w-full md:w-3/4 mb-6 md:mb-0 pr-0 md:pr-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Notes Section -->
                      <div>
                        <h4 class="font-archivo-narrow font-semibold text-base mb-2">{{ $t('orders.notes') }}</h4>
                        <div class="bg-black/5 rounded-lg p-3 max-h-[100px] overflow-y-auto">
                          <p v-if="order.notes" class="font-archivo text-xs whitespace-pre-wrap notes-text">
                            {{ order.notes }}
                          </p>
                          <p v-else class="font-archivo text-xs text-black/50 italic">
                            {{ $t('orders.noNotes') }}
                          </p>
                        </div>
                      </div>

                      <!-- Shipping Address Section -->
                      <div>
                        <h4 class="font-archivo-narrow font-semibold text-base mb-2">{{ $t('orders.shippingAddress') }}</h4>
                        <div class="bg-black/5 rounded-lg p-3 max-h-[100px] overflow-y-auto">
                          <div v-if="order.address" class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-empire-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div class="font-archivo text-xs">
                              <span class="font-medium">{{ order.customer_name }}</span>
                              <span class="block">{{ order.address }}, {{ order.number }}{{ order.complement ? `, ${order.complement}` : '' }}</span>
                              <span class="block" v-if="order.neighborhood">{{ order.neighborhood }}</span>
                              <span class="block">{{ order.city }}, {{ order.state }} {{ order.postal_code }}</span>
                              <span class="block" v-if="order.country">{{ order.country }}</span>
                              <span class="block mt-1 flex items-center" v-if="order.phone">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                {{ order.phone }}
                              </span>
                            </div>
                          </div>
                          <p v-else class="font-archivo text-xs text-black/50 italic">
                            {{ $t('orders.noShippingAddress') }}
                          </p>
                        </div>
                      </div>

                      <!-- Project Section -->
                      <div>
                        <h4 class="font-archivo-narrow font-semibold text-base mb-2">{{ $t('orders.project') }}</h4>
                        <div class="bg-black/5 rounded-lg p-3 max-h-[100px] overflow-y-auto">
                          <div v-if="order.project_name" class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-empire-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            <div class="font-archivo text-xs">
                              <span class="font-medium">{{ order.project_name }}</span>
                            </div>
                          </div>
                          <p v-else class="font-archivo text-xs text-black/50 italic">
                            {{ $t('orders.noProject') }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Totals Section (exibido apenas se o pedido tiver preços) -->
                  <div v-if="!isOrderWithoutPrices(order)" class="w-full md:w-1/4">
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
                          {{ formatPrice(order.tax_amount) }}
                        </span>
                      </div>

                      <div class="flex justify-end gap-8 w-full pt-2 border-t border-black/10">
                        <span class="font-archivo-narrow font-semibold text-xl">{{ $t('orders.total') }}</span>
                        <span class="font-archivo-narrow font-semibold text-xl w-[120px] text-right">
                          {{ formatPrice(calculateOrderTotal(order)) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Mensagem para pedidos sem preços -->
                  <div v-if="isOrderWithoutPrices(order)" class="w-full md:w-1/4">
                    <div class="flex flex-col gap-2 items-end">
                      <div class="flex justify-end gap-8 w-full pt-2">
                        <span class="font-archivo-narrow font-semibold text-xl text-gray-500">{{ $t('orders.noPriceOrder') }}</span>
                      </div>
                    </div>
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
import ColorCircle from '@/components/common/ColorCircle.vue'

import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'

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
  e.target.src = PLACEHOLDER_IMAGE_PATH

  // Se mesmo a imagem de fallback falhar, use uma imagem base64 mínima
  e.target.onerror = () => {
    e.target.onerror = null
  }
}

// Verifica se o pedido foi feito sem preços (toggle master desabilitado)
const isOrderWithoutPrices = (order) => {
  return order.total === null && order.shipping_cost === null && order.tax_amount === null
}

const calculateOrderTotal = (order) => {
  // Se o pedido foi feito sem preços, retorna 0
  if (isOrderWithoutPrices(order)) {
    return 0
  }

  const subtotal = order.items.reduce((total, item) => total + (item.unit_price * item.quantity), 0)
  const shipping = parseFloat(order.shipping_cost) || 0
  const tax = parseFloat(order.tax_amount) || 0

  return subtotal + shipping + tax
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notes-text {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>



