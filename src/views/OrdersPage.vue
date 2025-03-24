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
                <p class="font-archivo-narrow font-semibold text-xl">
                  {{ formatPrice(order.total) }}
                </p>
                <span :class="getStatusClass(order.status.toLowerCase())" class="inline-block px-3 py-1 rounded-full text-sm">
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="isOrderExpanded(order.id)" class="mt-4 border-t border-black/10 pt-4">
              <div v-for="item in order.items" :key="item.product_name" class="flex justify-between items-center py-2">
                <div class="flex-1">
                  <p class="font-archivo">{{ item.product_name }}</p>
                  <p class="text-sm text-black/60">
                    {{ $t('orders.quantity') }}: {{ item.quantity }} x {{ formatPrice(item.unit_price) }}
                  </p>
                </div>
                <p class="font-archivo-narrow font-semibold">
                  {{ formatPrice(item.total_price) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-4 py-2 rounded',
              currentPage === page 
                ? 'bg-empire-yellow text-black' 
                : 'bg-gray-200 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api' // Importando o serviço api configurado

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const expandedOrders = ref([]) // Adicionado ref para controlar as orders expandidas
const itemsPerPage = 5 // Alterado de 10 para 5

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
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = 'Error fetching orders'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page !== currentPage.value) {
    fetchOrders(page)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>






