<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('ordersSettings.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-8 md:leading-[40px]">
            {{ $t('ordersSettings.title') }}
          </h1>
        </div>

        <!-- Filtros -->
        <div class="bg-[#FAFAFA] p-4 md:p-6 mb-4 md:mb-6 rounded">
          <h2 class="font-archivo-narrow font-semibold text-lg md:text-xl mb-3 md:mb-4">{{ $t('ordersSettings.filters') }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
            <!-- Filtro por data -->
            <div class="form-group">
              <label class="block text-xs md:text-sm font-medium font-archivo mb-1">{{ $t('ordersSettings.dateRange') }}</label>
              <div class="flex space-x-1 md:space-x-2">
                <input
                  type="date"
                  v-model="filters.startDate"
                  class="form-input border border-gray-300 rounded w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                />
                <input
                  type="date"
                  v-model="filters.endDate"
                  class="form-input border border-gray-300 rounded w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                />
              </div>
            </div>

            <!-- Filtro por produto -->
            <div class="form-group">
              <label class="block text-xs md:text-sm font-medium font-archivo mb-1">{{ $t('ordersSettings.product') }}</label>
              <multiselect
                v-model="filters.products"
                :options="productOptions"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :placeholder="$t('ordersSettings.productPlaceholder')"
                :selectLabel="$t('ordersSettings.multiselect.selectLabel')"
                :selectedLabel="$t('ordersSettings.multiselect.selectedLabel')"
                :deselectLabel="$t('ordersSettings.multiselect.deselectLabel')"
                :noResult="$t('ordersSettings.multiselect.noResult')"
                :noOptions="$t('ordersSettings.multiselect.noOptions')"
                :noElement="$t('ordersSettings.multiselect.noElements')"
                label="name"
                track-by="id"
                class="w-full"
              />
            </div>

            <!-- Filtro por cidade -->
            <div class="form-group">
              <label class="block text-xs md:text-sm font-medium font-archivo mb-1">{{ $t('ordersSettings.city') }}</label>
              <multiselect
                v-model="filters.cities"
                :options="cityOptions"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :placeholder="$t('ordersSettings.cityPlaceholder')"
                :selectLabel="$t('ordersSettings.multiselect.selectLabel')"
                :selectedLabel="$t('ordersSettings.multiselect.selectedLabel')"
                :deselectLabel="$t('ordersSettings.multiselect.deselectLabel')"
                :noResult="$t('ordersSettings.multiselect.noResult')"
                :noOptions="$t('ordersSettings.multiselect.noOptions')"
                :noElement="$t('ordersSettings.multiselect.noElements')"
                label="name"
                track-by="id"
                class="w-full"
              />
            </div>

            <!-- Filtro por projetos (multiselect) -->
            <div class="form-group">
              <label class="block text-xs md:text-sm font-medium font-archivo mb-1">{{ $t('ordersSettings.projects') }}</label>
              <multiselect
                v-model="filters.projects"
                :options="projectOptions"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :placeholder="$t('ordersSettings.projectsPlaceholder')"
                :selectLabel="$t('ordersSettings.multiselect.selectLabel')"
                :selectedLabel="$t('ordersSettings.multiselect.selectedLabel')"
                :deselectLabel="$t('ordersSettings.multiselect.deselectLabel')"
                :noResult="$t('ordersSettings.multiselect.noResult')"
                :noOptions="$t('ordersSettings.multiselect.noOptions')"
                :noElement="$t('ordersSettings.multiselect.noElements')"
                label="name"
                track-by="id"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
            <div class="flex space-x-2 w-full md:w-auto">
              <button
                @click="applyFilters"
                class="bg-empire-yellow hover:bg-yellow-500 text-black font-archivo py-1.5 md:py-2 px-3 md:px-4 rounded flex items-center text-xs md:text-sm flex-1 md:flex-none justify-center md:justify-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {{ $t('ordersSettings.applyFilters') }}
              </button>
              <button
                @click="resetFilters"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-archivo py-1.5 md:py-2 px-3 md:px-4 rounded flex items-center text-xs md:text-sm flex-1 md:flex-none justify-center md:justify-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ $t('ordersSettings.resetFilters') }}
              </button>
            </div>
            <button
              @click="exportToExcel"
              class="bg-empire-yellow hover:bg-yellow-500 text-black font-archivo py-1.5 md:py-2 px-3 md:px-4 rounded flex items-center text-xs md:text-sm w-full md:w-auto justify-center"
              :disabled="isExporting"
            >
              <svg v-if="!isExporting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isExporting">{{ $t('ordersSettings.exporting') }}</span>
              <span v-else>{{ $t('ordersSettings.exportToExcel') }}</span>
            </button>
          </div>
        </div>

        <!-- Tabela de pedidos -->
        <div class="bg-[#FAFAFA] p-4 md:p-6 rounded">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 space-y-2 md:space-y-0">
            <h2 class="font-archivo-narrow font-semibold text-lg md:text-xl">{{ $t('ordersSettings.ordersList') }}</h2>
            <div class="flex items-center space-x-2 w-full md:w-auto">
              <label class="text-xs md:text-sm font-medium font-archivo">{{ $t('ordersSettings.sortBy') }}</label>
              <select
                v-model="sortOption"
                class="border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-empire-yellow flex-1 md:flex-none"
                @change="applyFilters"
              >
                <option value="date_desc">{{ $t('ordersSettings.dateNewest') }}</option>
                <option value="date_asc">{{ $t('ordersSettings.dateOldest') }}</option>
                <option value="total_desc">{{ $t('ordersSettings.totalHighest') }}</option>
                <option value="total_asc">{{ $t('ordersSettings.totalLowest') }}</option>
              </select>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="flex justify-center items-center py-6 md:py-8">
            <div class="w-8 h-8 md:w-12 md:h-12 border-4 border-empire-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- Tabela -->
          <div v-else-if="orders.length > 0" class="overflow-x-auto">
            <!-- Tabela com scroll horizontal para mobile -->
            <div class="min-w-[700px] md:min-w-0">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.orderNumber') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.date') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.project') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.city') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.total') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.status') }}
                  </th>
                  <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                    {{ $t('ordersSettings.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    {{ order.order_number }}
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                    {{ order.project_name || $t('ordersSettings.noProject') }}
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    {{ order.city }}
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    {{ formatCurrency(order.total) }}
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    <span :class="getStatusClass(order.status)">
                      {{ $t(`ordersSettings.status_${order.status}`) }}
                    </span>
                  </td>
                  <td class="py-2 md:py-3 px-2 md:px-4 border-b text-xs md:text-sm">
                    <div class="flex space-x-2">
                      <button
                        @click="viewOrderDetails(order.id)"
                        class="text-empire-yellow hover:text-yellow-500 font-archivo"
                        :title="$t('ordersSettings.viewDetails')"
                      >
                        <!-- Ícone para mobile, texto para desktop -->
                        <span class="hidden md:inline">{{ $t('ordersSettings.viewDetails') }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click="openStatusModal(order)"
                        class="text-blue-600 hover:text-blue-800 font-archivo"
                        :title="$t('ordersSettings.updateStatus')"
                      >
                        <!-- Ícone para mobile, texto para desktop -->
                        <span class="hidden md:inline">{{ $t('ordersSettings.updateStatus') }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>

          <!-- Mensagem de nenhum pedido encontrado -->
          <div v-else class="text-center py-8 text-gray-500 font-archivo text-sm">
            {{ $t('ordersSettings.noOrdersFound') }}
          </div>

          <!-- Paginação -->
          <div v-if="totalPages > 1" class="flex justify-center mt-4 md:mt-6">
            <nav class="relative z-0 inline-flex font-archivo" aria-label="Pagination">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-l-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">{{ $t('ordersSettings.previous') }}</span>
                &laquo;
              </button>

              <template v-for="page in paginationRange" :key="page">
                <button
                  @click="changePage(page)"
                  :class="[
                    'relative inline-flex items-center px-2 md:px-4 py-1 md:py-2 border text-xs md:text-sm font-medium',
                    currentPage === page
                      ? 'z-10 bg-empire-yellow border-empire-yellow text-black'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-r-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              >
                <span class="sr-only">{{ $t('ordersSettings.next') }}</span>
                &raquo;
              </button>
            </nav>
          </div>
        </div>

        <!-- Modal de detalhes do pedido -->
        <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-3 md:p-6 w-full max-w-[95%] md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-2 md:mb-4">
              <h2 class="font-archivo-narrow font-semibold text-lg md:text-2xl">{{ $t('ordersSettings.orderDetails') }} #{{ selectedOrder.order_number }}</h2>
              <button @click="showOrderModal = false" class="text-gray-500 hover:text-gray-700 p-1">
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="isLoadingOrderDetails" class="flex justify-center items-center py-6 md:py-8">
              <div class="w-8 h-8 md:w-12 md:h-12 border-4 border-empire-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div v-else>
              <!-- Informações gerais do pedido -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div>
                  <h3 class="font-archivo-narrow font-semibold text-base md:text-lg mb-1 md:mb-2">{{ $t('ordersSettings.orderInfo') }}</h3>
                  <p class="font-archivo text-xs md:text-sm"><span class="font-medium">{{ $t('ordersSettings.date') }}:</span> {{ formatDate(selectedOrder.created_at) }}</p>
                  <p class="font-archivo text-xs md:text-sm"><span class="font-medium">{{ $t('ordersSettings.status') }}:</span> {{ $t(`ordersSettings.status_${selectedOrder.status}`) }}</p>

                  <h3 class="font-archivo-narrow font-semibold text-base md:text-lg mb-1 md:mb-2 mt-3">{{ $t('ordersSettings.additionalInfo') }}</h3>

                  <!-- Project -->
                  <p class="font-archivo text-xs md:text-sm flex items-center">
                    <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span class="font-medium">{{ $t('ordersSettings.project') }}:</span> {{ selectedOrder.project_name || $t('ordersSettings.noProject') }}
                  </p>

                  <!-- Contact on Site -->
                  <p v-if="selectedOrder.contact_on_site" class="font-archivo text-xs md:text-sm flex items-center mt-1">
                    <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="font-medium">{{ $t('ordersSettings.contactOnSite') }}: </span><span class="font-semibold">{{ selectedOrder.contact_on_site }}</span>
                  </p>

                  <!-- Contact Phone -->
                  <p v-if="selectedOrder.contact_phone" class="font-archivo text-xs md:text-sm flex items-center mt-1">
                    <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span class="font-medium">{{ $t('ordersSettings.contactPhone') }}: </span><span class="font-semibold">{{ selectedOrder.contact_phone }}</span>
                  </p>

                  <!-- Delivery Date/Time -->
                  <p v-if="selectedOrder.delivery_date_time" class="font-archivo text-xs md:text-sm flex items-center mt-1">
                    <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">{{ $t('ordersSettings.deliveryDateTime') }}: </span><span class="font-semibold">{{ formatDateTime(selectedOrder.delivery_date_time) }}</span>
                  </p>

                  <p v-if="selectedOrder.notes" class="font-archivo text-xs md:text-sm mt-3"><span class="font-medium">{{ $t('ordersSettings.notes') }}:</span> {{ selectedOrder.notes }}</p>
                </div>

                <div>
                  <h3 class="font-archivo-narrow font-semibold text-base md:text-lg mb-1 md:mb-2">
                    {{ selectedOrder.delivery_method === 'pickup' ? $t('orders.pickupLocation') : $t('ordersSettings.shippingAddress') }}
                  </h3>

                  <!-- PO Number (exibido para ambos os métodos de entrega) -->
                  <p v-if="selectedOrder.po_number" class="font-archivo text-xs md:text-sm mb-2 flex items-center">
                    <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="font-medium">{{ $t('ordersSettings.poNumber') }}: </span><span class="font-semibold">{{ selectedOrder.po_number }}</span>
                  </p>

                  <!-- Endereço de entrega (delivery) -->
                  <template v-if="selectedOrder.delivery_method === 'delivery' || !selectedOrder.delivery_method">
                    <p class="font-archivo text-xs md:text-sm flex items-center">
                      <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ selectedOrder.address }}{{ selectedOrder.landmark ? ', ' + selectedOrder.landmark : '' }}
                    </p>
                    <p class="font-archivo text-xs md:text-sm ml-4">{{ selectedOrder.city }}{{ selectedOrder.state ? ', ' + selectedOrder.state : '' }} {{ selectedOrder.postal_code }}</p>
                    <p v-if="selectedOrder.country" class="font-archivo text-xs md:text-sm ml-4">{{ selectedOrder.country }}</p>

                    <!-- Special Delivery Instructions (sem label e ícone) -->
                    <p v-if="selectedOrder.special_instructions" class="font-archivo text-xs md:text-sm mt-2 text-gray-600 italic ml-4">
                      {{ selectedOrder.special_instructions }}
                    </p>
                  </template>

                  <!-- Local de retirada (pickup) -->
                  <template v-else-if="selectedOrder.delivery_method === 'pickup'">
                    <p class="font-archivo text-xs md:text-sm flex items-center">
                      <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                      </svg>
                      <span class="font-medium">{{ $t('orders.pickupAt') }}:</span>
                      {{ selectedOrder.location_description || $t('orders.noLocationSpecified') }}
                    </p>
                  </template>
                </div>
              </div>

              <!-- Itens do pedido -->
              <h3 class="font-archivo-narrow font-semibold text-base md:text-lg mb-1 md:mb-2">{{ $t('ordersSettings.orderItems') }}</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                        {{ $t('ordersSettings.product') }}
                      </th>
                      <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                        {{ $t('ordersSettings.quantity') }}
                      </th>
                      <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                        {{ $t('ordersSettings.unitPrice') }}
                      </th>
                      <th class="py-2 md:py-3 px-2 md:px-4 border-b text-left font-archivo font-semibold text-xs md:text-sm">
                        {{ $t('ordersSettings.totalPrice') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in selectedOrder.items" :key="index" class="hover:bg-gray-50">
                      <td class="py-2 md:py-3 px-2 md:px-4 border-b">
                        <div class="flex items-center">
                          <img
                            v-if="item.image"
                            :src="item.image"
                            class="h-8 w-8 md:h-10 md:w-10 object-cover mr-1 md:mr-2"
                            alt="Product image"
                          />
                          <div>
                            <div class="font-archivo text-xs md:text-sm">{{ item.product_name }}</div>
                            <div v-if="item.color || item.size || item.weight || item.unit" class="text-[10px] md:text-xs text-gray-500 font-archivo">
                              <span v-if="item.color">{{ $t('ordersSettings.color') }}: {{ item.color }}</span>
                              <span v-if="item.size" class="ml-1">{{ $t('ordersSettings.size') }}: {{ item.size }}</span>
                              <span v-if="item.weight" class="ml-1">{{ $t('ordersSettings.weight') }}: {{ item.weight }}</span>
                              <span v-if="item.unit" class="ml-1">{{ $t('ordersSettings.unit') }}: {{ item.unit }}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-2 md:py-3 px-2 md:px-4 border-b font-archivo text-xs md:text-sm">
                        {{ item.quantity }}
                      </td>
                      <td class="py-2 md:py-3 px-2 md:px-4 border-b font-archivo text-xs md:text-sm">
                        {{ formatCurrency(item.unit_price) }}
                      </td>
                      <td class="py-2 md:py-3 px-2 md:px-4 border-b font-archivo text-xs md:text-sm">
                        {{ formatCurrency(item.total_price) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Resumo do pedido -->
              <div class="mt-3 md:mt-4 flex justify-end">
                <div class="w-48 md:w-64">
                  <div class="flex justify-between py-1 font-archivo text-xs md:text-sm">
                    <span class="font-medium">{{ $t('ordersSettings.subtotal') }}:</span>
                    <span>{{ formatCurrency(calculateSubtotal()) }}</span>
                  </div>
                  <div v-if="selectedOrder.shipping_cost !== null" class="flex justify-between py-1 font-archivo text-xs md:text-sm">
                    <span class="font-medium">{{ $t('ordersSettings.shippingCost') }}:</span>
                    <span>{{ formatCurrency(selectedOrder.shipping_cost) }}</span>
                  </div>
                  <div v-if="selectedOrder.tax_amount !== null" class="flex justify-between py-1 font-archivo text-xs md:text-sm">
                    <span class="font-medium">{{ $t('ordersSettings.taxAmount') }}:</span>
                    <span>{{ formatCurrency(selectedOrder.tax_amount) }}</span>
                  </div>
                  <div class="flex justify-between py-1 font-bold border-t border-gray-200 mt-1 pt-1 font-archivo text-xs md:text-sm">
                    <span>{{ $t('ordersSettings.total') }}:</span>
                    <span>{{ formatCurrency(selectedOrder.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de atualização de status -->
        <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-4 md:p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-archivo-narrow font-semibold text-lg md:text-xl">
                {{ $t('ordersSettings.updateOrderStatus') }}
              </h2>
              <button @click="closeStatusModal" class="text-gray-500 hover:text-gray-700 p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div v-if="selectedOrderForStatus">
              <div class="mb-4">
                <p class="font-archivo text-sm text-gray-600 mb-2">
                  {{ $t('ordersSettings.orderNumber') }}: <span class="font-semibold">{{ selectedOrderForStatus.order_number }}</span>
                </p>
                <p class="font-archivo text-sm text-gray-600 mb-4">
                  {{ $t('ordersSettings.currentStatus') }}:
                  <span :class="getStatusClass(selectedOrderForStatus.status)" class="font-semibold">
                    {{ $t(`ordersSettings.status_${selectedOrderForStatus.status}`) }}
                  </span>
                </p>
              </div>

              <div class="mb-6">
                <label class="block font-archivo text-sm font-medium mb-2">
                  {{ $t('ordersSettings.newStatus') }}:
                </label>
                <select
                  v-model="newStatus"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                >
                  <option value="pending">{{ $t('ordersSettings.status_pending') }}</option>
                  <option value="processing">{{ $t('ordersSettings.status_processing') }}</option>
                  <option value="completed">{{ $t('ordersSettings.status_completed') }}</option>
                  <option value="cancelled">{{ $t('ordersSettings.status_cancelled') }}</option>
                </select>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  @click="closeStatusModal"
                  class="px-4 py-2 text-sm font-archivo text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  {{ $t('ordersSettings.cancel') }}
                </button>
                <button
                  @click="updateOrderStatus"
                  :disabled="isUpdatingStatus || newStatus === selectedOrderForStatus.status"
                  class="px-4 py-2 text-sm font-archivo bg-empire-yellow text-black rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isUpdatingStatus">{{ $t('ordersSettings.updating') }}...</span>
                  <span v-else>{{ $t('ordersSettings.updateStatus') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
// XLSX é importado dinamicamente no método exportToExcel
import { adminProjectService } from '@/services/adminProjectService'
import { adminProductService } from '@/services/adminProductService'
import { adminAddressService } from '@/services/adminAddressService'
import { adminOrderService } from '@/services/adminOrderService'
/* eslint-enable */

export default {
  name: 'OrdersSettingsPage',
  components: {
    Multiselect
  },
  setup() {
    // Obter a instância i18n no nível superior da função setup
    const { t } = useI18n()

    // Estado
    const orders = ref([])
    const totalOrders = ref(0)
    const currentPage = ref(1)
    const totalPages = ref(0)
    const pageSize = ref(10)
    const isLoading = ref(false)
    const isExporting = ref(false)
    const projectOptions = ref([])
    const productOptions = ref([])
    const cityOptions = ref([])
    const sortOption = ref('date_desc')

    // Filtros
    const filters = ref({
      startDate: '',
      endDate: '',
      products: [],
      cities: [],
      projects: []
    })

    // Modal de detalhes do pedido
    const showOrderModal = ref(false)
    const selectedOrder = ref({})
    const isLoadingOrderDetails = ref(false)

    // Modal de atualização de status
    const showStatusModal = ref(false)
    const selectedOrderForStatus = ref(null)
    const newStatus = ref('')
    const isUpdatingStatus = ref(false)

    // Carregar projetos para o filtro
    const loadProjects = async () => {
      try {
        projectOptions.value = await adminProjectService.getAllProjects()
      } catch (error) {
        console.error('Erro ao carregar projetos:', error)
      }
    }

    // Carregar produtos para o filtro
    const loadProducts = async () => {
      try {
        const products = await adminProductService.getAllProducts()
        productOptions.value = products.map(product => ({
          id: product.id,
          name: product.name
        }))
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      }
    }

    // Carregar cidades para o filtro
    const loadCities = async () => {
      try {
        const cities = await adminAddressService.getAllShippingCities()
        cityOptions.value = cities.map(city => ({
          id: city,
          name: city
        }))
      } catch (error) {
        console.error('Erro ao carregar cidades:', error)
      }
    }

    // Carregar pedidos
    const loadOrders = async () => {
      isLoading.value = true

      try {
        // Preparar filtros para a requisição
        const orderFilters = {
          page: currentPage.value,
          limit: pageSize.value,
          sort: sortOption.value,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate,
          products: filters.value.products,
          cities: filters.value.cities,
          projects: filters.value.projects
        }

        const response = await adminOrderService.getOrders(orderFilters)

        orders.value = response.items
        totalOrders.value = response.total
        totalPages.value = response.totalPages
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Aplicar filtros
    const applyFilters = () => {
      currentPage.value = 1
      loadOrders()
    }

    // Resetar filtros
    const resetFilters = () => {
      filters.value = {
        startDate: '',
        endDate: '',
        products: [],
        cities: [],
        projects: []
      }
      sortOption.value = 'date_desc'
      currentPage.value = 1
      loadOrders()
    }

    // Mudar página
    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return
      currentPage.value = page
      loadOrders()
    }

    // Visualizar detalhes do pedido
    const viewOrderDetails = async (orderId) => {
      showOrderModal.value = true
      isLoadingOrderDetails.value = true

      try {
        selectedOrder.value = await adminOrderService.getOrderDetails(orderId)
      } catch (error) {
        console.error('Erro ao carregar detalhes do pedido:', error)
      } finally {
        isLoadingOrderDetails.value = false
      }
    }

    // Abrir modal de atualização de status
    const openStatusModal = (order) => {
      selectedOrderForStatus.value = order
      newStatus.value = order.status
      showStatusModal.value = true
    }

    // Fechar modal de atualização de status
    const closeStatusModal = () => {
      showStatusModal.value = false
      selectedOrderForStatus.value = null
      newStatus.value = ''
      isUpdatingStatus.value = false
    }

    // Atualizar status do pedido
    const updateOrderStatus = async () => {
      if (!selectedOrderForStatus.value || newStatus.value === selectedOrderForStatus.value.status) {
        return
      }

      isUpdatingStatus.value = true

      try {
        await adminOrderService.updateOrderStatus(selectedOrderForStatus.value.id, newStatus.value)

        // Atualizar o status na lista local
        const orderIndex = orders.value.findIndex(o => o.id === selectedOrderForStatus.value.id)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = newStatus.value
        }

        // Fechar modal
        closeStatusModal()

        // Mostrar mensagem de sucesso (opcional)
        console.log('Status do pedido atualizado com sucesso')
      } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error)
        alert(t('ordersSettings.errorUpdatingStatus'))
      } finally {
        isUpdatingStatus.value = false
      }
    }

    // Exportar para Excel
    const exportToExcel = async () => {
      isExporting.value = true
      console.log('Iniciando exportação para Excel')

      try {
        // Preparar filtros para a requisição
        const exportFilters = {
          sort: sortOption.value,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate,
          products: filters.value.products,
          cities: filters.value.cities,
          projects: filters.value.projects
        }
        console.log('Filtros para exportação:', exportFilters)

        const data = await adminOrderService.exportOrders(exportFilters)
        console.log('Dados recebidos do servidor:', data.length, 'registros')

        // Verificar se temos dados para exportar
        if (!data || data.length === 0) {
          console.log('Nenhum dado para exportar')
          alert('Nenhum pedido encontrado para exportar')
          isExporting.value = false
          return
        }

        // Gerar nome do arquivo com data e hora atual
        const now = new Date()
        const dateStr = now.toISOString().replace(/[-:]/g, '').split('.')[0]
        const fileName = `${t('ordersSettings.excel.fileName')}_${dateStr}.xlsx`
        console.log('Nome do arquivo:', fileName)

        // Reimportar XLSX dinamicamente para evitar problemas
        try {
          console.log('Iniciando criação do arquivo Excel')

          // Importar XLSX dinamicamente
          import('xlsx').then(XLSX => {
            console.log('Biblioteca XLSX importada com sucesso')

            try {
              // Criar uma planilha com os dados
              const worksheet = XLSX.utils.json_to_sheet(data)
              console.log('Worksheet criada')

              // Criar um novo workbook e adicionar a planilha
              const workbook = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
              console.log('Workbook criado e worksheet adicionada')

              // Converter workbook para array buffer
              const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
              console.log('Workbook convertido para array buffer')

              // Criar um Blob a partir do array buffer
              const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
              console.log('Blob criado')

              // Criar URL para o blob
              const url = URL.createObjectURL(blob)
              console.log('URL criada:', url)

              // Criar um link para download e clicar nele
              const link = document.createElement('a')
              link.href = url
              link.download = fileName
              document.body.appendChild(link)
              console.log('Link criado e adicionado ao documento')

              // Forçar o clique no link
              link.click()
              console.log('Link clicado')

              // Remover o link
              setTimeout(() => {
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                console.log('Link removido e URL revogada')
              }, 100)

              console.log('Download iniciado com sucesso')
              // Definir isExporting como false após o download
              isExporting.value = false
            } catch (xlsxError) {
              console.error('Erro ao processar dados para Excel:', xlsxError)
              alert('Erro ao gerar arquivo Excel. Verifique o console para mais detalhes.')
              isExporting.value = false
            }
          }).catch(importError => {
            console.error('Erro ao importar biblioteca XLSX:', importError)
            alert('Erro ao carregar biblioteca de exportação. Verifique o console para mais detalhes.')
            isExporting.value = false
          })
        } catch (error) {
          console.error('Erro ao gerar arquivo Excel:', error)
          alert('Erro ao gerar arquivo Excel. Verifique o console para mais detalhes.')
          isExporting.value = false
        }
      } catch (error) {
        console.error('Erro ao exportar pedidos:', error)
      } finally {
        isExporting.value = false
      }
    }

    // Formatar data
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR').format(date)
    }

    // Formatar data e hora
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return ''
      const date = new Date(dateTimeString)
      // Exibir apenas a data, sem horário
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    }

    // Função para obter classe CSS do status
    const getStatusClass = (status) => {
      const statusClasses = {
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        completed: 'text-green-600',
        cancelled: 'text-red-600'
      }
      return statusClasses[status] || 'text-gray-600'
    }

    // Formatar moeda
    const formatCurrency = (value) => {
      if (value === null || value === undefined) return '-'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }



    // Calcular subtotal
    const calculateSubtotal = () => {
      if (!selectedOrder.value.items) return 0
      return selectedOrder.value.items.reduce((sum, item) => sum + item.total_price, 0)
    }

    // Range de páginas para paginação
    const paginationRange = computed(() => {
      const range = []
      const maxVisiblePages = 5

      if (totalPages.value <= maxVisiblePages) {
        // Mostrar todas as páginas se o total for menor que o máximo visível
        for (let i = 1; i <= totalPages.value; i++) {
          range.push(i)
        }
      } else {
        // Calcular o range de páginas a serem exibidas
        let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
        let end = start + maxVisiblePages - 1

        if (end > totalPages.value) {
          end = totalPages.value
          start = Math.max(1, end - maxVisiblePages + 1)
        }

        for (let i = start; i <= end; i++) {
          range.push(i)
        }
      }

      return range
    })

    // Inicialização
    onMounted(() => {
      loadProjects()
      loadProducts()
      loadCities()
      loadOrders()
    })

    return {
      orders,
      totalOrders,
      currentPage,
      totalPages,
      pageSize,
      isLoading,
      isExporting,
      projectOptions,
      productOptions,
      cityOptions,
      sortOption,
      filters,
      showOrderModal,
      selectedOrder,
      isLoadingOrderDetails,
      showStatusModal,
      selectedOrderForStatus,
      newStatus,
      isUpdatingStatus,
      paginationRange,
      loadOrders,
      applyFilters,
      resetFilters,
      changePage,
      viewOrderDetails,
      openStatusModal,
      closeStatusModal,
      updateOrderStatus,
      exportToExcel,
      formatDate,
      formatDateTime,
      formatCurrency,
      getStatusClass,
      calculateSubtotal
    }
  }
}
</script>

<style scoped>

/* Estilos para o multiselect */
:deep(.multiselect) {
  min-height: 38px;
}

:deep(.multiselect__tags) {
  min-height: 38px;
  padding: 6px 40px 0 8px;
  border-radius: 0.375rem;
  border-color: #d1d5db;
  font-size: 0.875rem;
}

:deep(.multiselect__select) {
  height: 38px;
}

:deep(.multiselect__tag) {
  background: #ffdd00;
  color: #000;
  font-size: 0.75rem;
  padding: 4px 26px 4px 8px;
}

:deep(.multiselect__tag-icon) {
  line-height: 1.5;
}

:deep(.multiselect__tag-icon:after) {
  color: #000;
  font-size: 0.75rem;
}

:deep(.multiselect__tag-icon:hover) {
  background: #e6c700;
}

:deep(.multiselect__option) {
  font-size: 0.875rem;
  padding: 8px 12px;
  min-height: auto;
}

:deep(.multiselect__option--highlight) {
  background: #ffdd00;
  color: #000;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: #e6c700;
  color: #000;
}

:deep(.multiselect__placeholder) {
  font-size: 0.875rem;
  padding-top: 0;
  margin-bottom: 0;
}

:deep(.multiselect__input) {
  font-size: 0.875rem;
}

/* Estilo para o select de ordenação */
select {
  font-size: 0.875rem;
}
</style>
