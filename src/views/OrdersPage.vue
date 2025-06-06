<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-4 md:mb-8">
          <nav class="flex items-center gap-1 md:gap-2 font-archivo text-xs md:text-sm text-black/70">
            <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('orders.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-4 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-8 md:leading-[40px]">
            {{ $t('orders.title') }}
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4 md:py-8">
          <div class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-empire-yellow mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-4 md:py-8 text-red-600 text-sm md:text-base">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!orders.length" class="text-center py-4 md:py-8">
          <svg class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 17h6M9 13h6M3 8h18v13H3V8zM3 8l2-4h14l2 4"/>
          </svg>
          <p class="text-lg md:text-xl font-archivo mb-3 md:mb-4">{{ $t('orders.noOrders') }}</p>
          <router-link
            to="/categories"
            class="inline-block bg-empire-yellow text-black font-archivo font-semibold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded hover:bg-yellow-400 transition-colors"
          >
            {{ $t('orders.startShopping') }}
          </router-link>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-4 md:space-y-6">
          <div v-for="order in orders" :key="order.id" class="border-2 border-black/10 rounded-lg p-3 md:p-6">
            <div
              class="flex flex-wrap justify-between items-start gap-2 md:gap-4 mb-2 md:mb-4 cursor-pointer"
              @click="toggleOrder(order.id)"
            >
              <div>
                <h3 class="font-archivo-narrow font-semibold text-base md:text-xl mb-0.5 md:mb-1">
                  {{ $t('orders.orderNumber', { number: order.order_number }) }}
                </h3>
                <p class="text-black/60 font-archivo text-xs md:text-sm">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>
              <div class="text-right">
                <p v-if="!isOrderExpanded(order.id) && !isOrderWithoutPrices(order)" class="font-archivo-narrow font-semibold text-base md:text-xl">
                  {{ formatPrice(calculateOrderTotal(order)) }}
                </p>
                <p v-if="!isOrderExpanded(order.id) && isOrderWithoutPrices(order)" class="font-archivo-narrow font-semibold text-base md:text-xl text-gray-500">
                  {{ $t('orders.noPriceOrder') }}
                </p>
                <span :class="getStatusClass(order.status.toLowerCase())" class="inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm">
                  {{ $t(`orders.status.${order.status.toLowerCase()}`) }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="isOrderExpanded(order.id)">
              <div class="mt-3 md:mt-4 border-t border-black/10 pt-3 md:pt-4">
                <div v-for="item in order.items" :key="item.product_id" class="flex items-center gap-2 md:gap-4 w-full mb-3 md:mb-4 last:mb-0">
                  <!-- Container principal do produto -->
                  <div class="flex items-center gap-1 md:gap-2 flex-1 min-w-0 h-16">
                    <!-- Imagem do produto -->
                    <div class="shrink-0">
                      <router-link
                        v-if="item.product_id"
                        :to="{ name: 'ProductDetails', params: { id: item.product_id } }"
                        class="block"
                      >
                        <img
                          :src="imageService.getProductImageUrl(item.image)"
                          :alt="item.product_name"
                          @error="handleImageError"
                          class="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                        />
                      </router-link>
                      <img
                        v-else
                        :src="imageService.getProductImageUrl(item.image)"
                        :alt="item.product_name"
                        @error="handleImageError"
                        class="w-12 h-12 md:w-16 md:h-16 object-cover rounded shrink-0"
                      />
                    </div>

                    <!-- Container do nome e quantidade -->
                    <div class="flex flex-col sm:flex-row items-center gap-2 min-w-0 flex-1">
                      <!-- Descrição, nome do produto e quantidade (na mesma linha em mobile) -->
                      <div class="min-w-0 sm:w-[250px] md:w-[525px] flex flex-col justify-center my-auto">  <!-- Removida altura fixa e adicionado my-auto para centralização vertical perfeita -->
                        <!-- Descrição do produto em negrito (invertida com o nome) -->
                        <div class="overflow-hidden mb-0">
                          <router-link
                            v-if="item.product_id"
                            :to="{ name: 'ProductDetails', params: { id: item.product_id } }"
                            class="hover:text-empire-yellow transition-colors"
                          >
                            <p class="font-archivo font-bold text-xs md:text-sm leading-tight text-black/90">
                              {{ item.product_description || item.product_name }}
                            </p>
                          </router-link>
                          <p v-else class="font-archivo font-bold text-xs md:text-sm leading-tight text-black/90">
                            {{ item.product_description || item.product_name }}
                          </p>
                        </div>

                        <div class="flex items-center justify-between">
                          <!-- Nome do produto -->
                          <div class="min-w-0 flex-1 pr-2">
                            <router-link
                              v-if="item.product_id"
                              :to="{ name: 'ProductDetails', params: { id: item.product_id } }"
                              class="hover:text-empire-yellow transition-colors font-archivo-narrow font-light text-[10px] md:text-[14px] leading-tight text-black/70 block truncate product-name"
                            >
                              {{ item.product_name }}
                            </router-link>
                            <span v-else class="font-archivo-narrow font-light text-[10px] md:text-[14px] leading-tight text-black/70 block truncate product-name">{{ item.product_name }}</span>
                          </div>

                          <!-- Quantidade em mobile (visível apenas em mobile) -->
                          <div class="sm:hidden flex items-center gap-1 font-archivo text-[10px] whitespace-nowrap">
                            <div class="flex items-center justify-center bg-black/5 px-1.5 py-0.5 rounded">
                              <!-- Quando tem preço, mostra quantidade, x, preço -->
                              <template v-if="!isOrderWithoutPrices(order)">
                                <span class="font-semibold">{{ item.quantity }}</span>
                                <span class="mx-1 text-black/60">x</span>
                                <span>{{ formatPrice(item.unit_price) }}</span>
                              </template>
                              <!-- Quando não tem preço, mostra quantidade, x -->
                              <template v-else>
                                <span class="font-semibold">{{ item.quantity }}</span>
                                <span class="mx-1 text-black/60">x</span>
                              </template>
                            </div>
                          </div>
                        </div>

                        <!-- Características do produto -->
                        <div v-if="item.color || item.size || item.weight || item.unit" class="flex flex-wrap gap-x-2 md:gap-x-3 mt-0.5 md:mt-1">
                          <span v-if="item.color" class="text-[10px] md:text-xs text-gray-600 flex items-center gap-0.5 md:gap-1">
                            <span class="font-semibold">{{ $t('productDetails.selectColor') }}:</span>
                            <span class="flex items-center gap-1">
                              <ColorCircle :color="item.color" :size="12" />
                            </span>
                          </span>
                          <span v-if="item.size" class="text-[10px] md:text-xs text-gray-600">
                            <span class="font-semibold">{{ $t('productDetails.selectSize') }}:</span> {{ item.size }}
                          </span>
                          <span v-if="item.weight" class="text-[10px] md:text-xs text-gray-600">
                            <span class="font-semibold">{{ $t('productDetails.selectWeight') }}:</span> {{ item.weight }}
                          </span>
                          <span v-if="item.unit" class="text-[10px] md:text-xs text-gray-600">
                            <span class="font-semibold">{{ $t('productDetails.selectUnit') }}:</span> {{ item.unit }}
                          </span>
                        </div>
                      </div>

                      <!-- Quantidade e preço unitário (visível apenas em desktop) -->
                      <div class="hidden sm:flex items-center gap-1 font-archivo text-xs whitespace-nowrap mx-auto pt-2 md:pt-4">
                        <div class="flex items-center justify-center bg-black/5 px-2 md:px-3 py-0.5 md:py-1 rounded">
                          <!-- Quando tem preço, mostra quantidade, x, preço -->
                          <template v-if="!isOrderWithoutPrices(order)">
                            <span class="font-semibold">{{ item.quantity }}</span>
                            <span class="mx-2 text-black/60">x</span>
                            <span class="text-sm">{{ formatPrice(item.unit_price) }}</span>
                          </template>
                          <!-- Quando não tem preço, mostra quantidade, x -->
                          <template v-else>
                            <span class="font-semibold">{{ item.quantity }}</span>
                            <span class="mx-2 text-black/60">x</span>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Preço total com largura fixa (exibido apenas se o pedido tiver preços) -->
                  <div v-if="!isOrderWithoutPrices(order)" class="w-[60px] sm:w-[80px] md:w-[120px] flex-shrink-0 text-right sm:self-center">
                    <p class="font-archivo-narrow font-semibold text-xs sm:text-sm md:text-xl">
                      {{ formatPrice(item.total_price) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sumário do pedido -->
              <div class="border-t border-black/10 mt-4 md:mt-6 pt-3 md:pt-4">
                <div class="flex flex-wrap justify-between">
                  <!-- Informações do pedido: Endereço e Informações Adicionais -->
                  <div class="w-full md:w-3/4 mb-4 md:mb-0 pr-0 md:pr-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <!-- Notes Section (oculta) -->
                      <div v-if="false">
                        <h4 class="font-archivo-narrow font-semibold text-sm md:text-base mb-1 md:mb-2">{{ $t('orders.notes') }}</h4>
                        <div class="bg-black/5 rounded-lg p-2 md:p-3 max-h-[80px] md:max-h-[100px] overflow-y-auto">
                          <p v-if="order.notes" class="font-archivo text-xs whitespace-pre-wrap notes-text">
                            {{ order.notes }}
                          </p>
                          <p v-else class="font-archivo text-xs text-black/50 italic">
                            {{ $t('orders.noNotes') }}
                          </p>
                        </div>
                      </div>

                      <!-- Shipping/Pickup Address Section (primeira coluna) -->
                      <div>
                        <h4 class="font-archivo-narrow font-semibold text-sm md:text-base mb-1 md:mb-2">
                          {{ order.delivery_method === 'pickup' ? $t('orders.pickupLocation') : $t('orders.shippingAddress') }}
                        </h4>
                        <div class="bg-black/5 rounded-lg p-2 md:p-3 max-h-[150px] md:max-h-[180px] overflow-y-auto">
                          <!-- PO Number (exibido para ambos os métodos de entrega) -->
                          <div v-if="order.po_number" class="flex items-start gap-2 mb-2">
                            <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>
                              <div><span class="font-medium font-archivo text-xs">{{ $t('orders.poNumber') }}: </span></div>
                              <div class="font-semibold font-archivo text-xs">{{ order.po_number }}</div>
                            </div>
                          </div>

                          <!-- Endereço de entrega (delivery) -->
                          <div v-if="order.delivery_method === 'delivery' && order.address" class="flex items-start gap-2">
                            <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div class="font-archivo text-xs">
                              <span class="font-medium">{{ order.customer_name }}</span>
                              <span class="block">{{ order.address }}{{ order.landmark ? ', ' + order.landmark : '' }}</span>
                              <span class="block">{{ order.city }} {{ order.postal_code }}</span>
                              <span class="block mt-1 flex items-center" v-if="order.phone">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                {{ order.phone }}
                              </span>
                              <!-- Special Delivery Instructions (sem label e ícone) -->
                              <span class="block mt-1 text-gray-600 italic" v-if="order.special_instructions">
                                {{ order.special_instructions }}
                              </span>
                            </div>
                          </div>

                          <!-- Local de retirada (pickup) -->
                          <div v-else-if="order.delivery_method === 'pickup'" class="flex items-start gap-2">
                            <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                            </svg>
                            <div class="font-archivo text-xs">
                              <span class="font-medium">{{ $t('orders.pickupAt') }}</span>
                              <span class="block">{{ order.location_description || $t('orders.noLocationSpecified') }}</span>
                              <!-- Special Pickup Instructions (sem label e ícone) -->
                              <span class="block mt-1 text-gray-600 italic" v-if="order.special_instructions">
                                {{ order.special_instructions }}
                              </span>
                            </div>
                          </div>

                          <p v-else class="font-archivo text-xs text-black/50 italic">
                            {{ $t('orders.noShippingAddress') }}
                          </p>
                        </div>
                      </div>

                      <!-- Additional Info Section (segunda coluna) -->
                      <div>
                        <h4 class="font-archivo-narrow font-semibold text-sm md:text-base mb-1 md:mb-2">{{ $t('orders.additionalInfo') }}</h4>
                        <div class="bg-black/5 rounded-lg p-2 md:p-3 max-h-[150px] md:max-h-[180px] overflow-y-auto">
                          <div class="flex items-start gap-2">
                            <div class="font-archivo text-xs">
                              <!-- Project Name (if available) -->
                              <div class="flex items-center">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <span v-if="order.project_name">
                                  <span class="font-medium">{{ $t('orders.project') }}:</span> {{ order.project_name }}
                                </span>
                                <span v-else>
                                  <span class="font-medium">{{ $t('orders.project') }}:</span> <span class="italic text-black/50">{{ $t('orders.noProject') }}</span>
                                </span>
                              </div>

                              <!-- Contact on Site -->
                              <div v-if="order.contact_on_site" class="mt-2 flex items-start">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <div>
                                  <div><span class="font-medium">{{ $t('orders.contactOnSite') }}: </span></div>
                                  <div class="font-semibold">{{ order.contact_on_site }}</div>
                                </div>
                              </div>

                              <!-- Contact Phone -->
                              <div v-if="order.contact_phone" class="mt-2 flex items-start">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <div>
                                  <div><span class="font-medium">{{ $t('orders.contactPhone') }}: </span></div>
                                  <div class="font-semibold">{{ order.contact_phone }}</div>
                                </div>
                              </div>

                              <!-- Delivery Date/Time -->
                              <div v-if="order.delivery_date_time" class="mt-2 flex items-start">
                                <svg class="w-3 h-3 text-empire-yellow flex-shrink-0 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                  <div><span class="font-medium">{{ $t('orders.deliveryDateTime') }}: </span></div>
                                  <div class="font-semibold">{{ formatDateTime(order.delivery_date_time) }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Totals Section (exibido apenas se o pedido tiver preços) -->
                  <div v-if="!isOrderWithoutPrices(order)" class="w-full md:w-1/4">
                    <div class="flex flex-col gap-2 items-end">
                      <div class="flex justify-end gap-4 md:gap-8 w-full">
                        <span class="font-archivo text-black/70 text-xs md:text-sm">{{ $t('orders.shipping') }}</span>
                        <span class="font-archivo w-[80px] md:w-[120px] text-right text-xs md:text-sm">
                          {{ formatPrice(order.shipping_cost) }}
                        </span>
                      </div>

                      <div class="flex justify-end gap-4 md:gap-8 w-full">
                        <span class="font-archivo text-black/70 text-xs md:text-sm">{{ $t('orders.taxes') }}</span>
                        <span class="font-archivo w-[80px] md:w-[120px] text-right text-xs md:text-sm">
                          {{ formatPrice(order.tax_amount) }}
                        </span>
                      </div>

                      <div class="flex justify-end gap-4 md:gap-8 w-full pt-2 border-t border-black/10">
                        <span class="font-archivo-narrow font-semibold text-base md:text-xl">{{ $t('orders.total') }}</span>
                        <span class="font-archivo-narrow font-semibold text-base md:text-xl w-[80px] md:w-[120px] text-right">
                          {{ formatPrice(calculateOrderTotal(order)) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Mensagem para pedidos sem preços -->
                  <div v-if="isOrderWithoutPrices(order)" class="w-full md:w-1/4">
                    <div class="flex flex-col gap-2 items-end">
                      <div class="flex justify-end gap-4 md:gap-8 w-full pt-2">
                        <span class="font-archivo-narrow font-semibold text-base md:text-xl text-gray-500">{{ $t('orders.noPriceOrder') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div class="flex flex-col items-center mt-8 md:mt-12 mb-12 md:mb-24 w-full gap-3 md:gap-4">
          <div class="flex justify-center items-center gap-2 md:gap-4 w-full">
            <!-- Botão Previous -->
            <button
              class="flex items-center justify-center h-8 md:h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[70px] md:min-w-[120px]"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-inter font-medium text-xs md:text-base">{{ $t('categoryPage.previous') }}</span>
            </button>

            <!-- Números das Páginas -->
            <div class="flex gap-1 md:gap-2">
              <button
                v-for="page in displayedPages"
                :key="page"
                class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-xs md:text-base"
                :class="page === currentPage ? 'bg-black text-white' : 'bg-[#F9F9FB] text-black'"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <!-- Botão Next -->
            <button
              class="flex items-center justify-center h-8 md:h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[70px] md:min-w-[120px]"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <span class="font-inter font-medium text-xs md:text-base">{{ $t('categoryPage.next') }}</span>
              <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Contador de Items na paginação -->
          <div class="flex justify-center">
            <span class="font-inter text-xs md:text-base">
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
/* eslint-disable */
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/services/api'
import ColorCircle from '@/components/common/ColorCircle.vue'
import { useI18n } from 'vue-i18n'
import { imageService } from '@/services/imageService'
import { productService } from '@/services/productService'
import { getProductUrlWithDescription } from '@/utils/urlUtils'
// Removida importação não utilizada de PLACEHOLDER_IMAGE_PATH e NO_IMAGE_PATH

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 5
const expandedOrders = ref([]) // Adicionado ref para controlar as orders expandidas
const productDescriptions = ref({}) // Armazena as descrições dos produtos
const { locale } = useI18n() // Obtém o locale atual

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

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString();
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

// Função para carregar as descrições dos produtos
const loadProductDescriptions = async (items) => {
  try {
    const updatedItems = [...items];
    let hasUpdates = false;

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];

      // Verifica se já temos a descrição em cache
      if (productDescriptions.value[item.product_id]) {
        console.log('Description already in cache for product', item.product_id);
        // Adiciona a descrição diretamente ao item
        if (!item.product_description || item.product_description === item.product_name) {
          updatedItems[i] = {
            ...item,
            product_description: productDescriptions.value[item.product_id]
          };
          hasUpdates = true;
        }
        continue;
      }

      try {
        console.log('Fetching product details for product', item.product_id);
        const productDetails = await productService.getProductDetails(item.product_id);

        if (productDetails) {
          // Seleciona a descrição no idioma atual ou usa fallback para inglês
          const description = productDetails[`description_${locale.value}`] ||
                             productDetails.description_en ||
                             productDetails.description_fr ||
                             '';

          console.log('Got description for product', item.product_id, ':', description);

          // Armazena no cache
          productDescriptions.value[item.product_id] = description;

          // Adiciona a descrição diretamente ao item
          updatedItems[i] = {
            ...item,
            product_description: description
          };
          hasUpdates = true;
        }
      } catch (err) {
        console.error('Error fetching product details for product', item.product_id, ':', err);
      }
    }

    return hasUpdates ? updatedItems : items;
  } catch (error) {
    console.error('Error loading product descriptions:', error);
    return items;
  }
};

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
    const processedOrders = response.data.items.map(order => {
      return {
        ...order,
        status: order.status.toUpperCase()
      };
    });

    // Processa cada pedido para carregar as descrições dos produtos
    for (let i = 0; i < processedOrders.length; i++) {
      const order = processedOrders[i];
      if (order.items && order.items.length > 0) {
        // Carrega as descrições dos produtos para este pedido
        const updatedItems = await loadProductDescriptions(order.items);
        processedOrders[i].items = updatedItems;
      }
    }

    orders.value = processedOrders;
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

// Observa mudanças no idioma para atualizar as descrições
watch(locale, () => {
  if (orders.value.length > 0) {
    // Limpa o cache de descrições quando o idioma muda
    productDescriptions.value = {};
    // Recarrega os pedidos para atualizar as descrições
    fetchOrders(currentPage.value);
  }
});

onMounted(() => {
  fetchOrders()
})

const handleImageError = (e) => {
  // Usa a função utilitária do imageService para lidar com erros de imagem
  console.log('[OrdersPage] Tratando erro de imagem')
  imageService.handleImageError(e)
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

/* Estilo para manter a altura fixa da descrição com exatamente duas linhas */
.description-fixed-height {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 2.4em !important; /* Altura fixa para exatamente 2 linhas */
  min-height: 2.4em !important;
  max-height: 2.4em !important;
  line-height: 1.2em !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: break-word;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* Estilo personalizado para o nome do produto com espessura extra fina */
.product-name {
  font-weight: 100 !important; /* Força a espessura mais fina possível */
  opacity: 0.7 !important; /* Reduz ainda mais a opacidade para parecer mais fino */
  letter-spacing: 0.03em !important; /* Aumenta mais o espaçamento entre letras */
  color: rgba(0, 0, 0, 0.6) !important; /* Cor mais clara para parecer mais fino */
  transform: scale(0.98, 1) !important; /* Comprime ligeiramente na horizontal */
}
</style>



