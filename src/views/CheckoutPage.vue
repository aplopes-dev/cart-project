<template>
  <div class="checkout-page">
    <div class="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 max-w-[1408px] mx-auto">
        <LoadingSpinner />
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="py-16 text-center max-w-[1408px] mx-auto">
        <p class="text-red-500 text-lg mb-4">{{ error }}</p>
        <button @click="loadCheckoutData" class="bg-empire-yellow px-6 py-2 font-archivo-narrow font-semibold">
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else class="max-w-[1408px] mx-auto">
        <!-- Title -->
        <div class="pb-6 text-center">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-[30px] md:leading-[40px]">{{ $t('checkout.title') }}</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Personal Details Form -->
          <div class="lg:col-span-8">
            <div class="space-y-4 md:space-y-8 bg-[#FAFAFA] p-4 md:p-8">
              <!-- Personal Details Section (temporariamente oculto) -->
              <section v-if="false">
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('personal')">
                  <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl">{{ $t('checkout.personalDetails') }}</h2>
                  <svg
                    class="section-arrow lg:hidden absolute right-0"
                    :class="{ 'rotate-270': sections.personal }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                  </svg>
                </div>
                <div v-show="sections.personal || isDesktop" class="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.firstName') }}</label>
                    <input
                      type="text"
                      v-model="formData.firstName"
                      :placeholder="$t('checkout.firstNamePlaceholder')"
                      :class="[
                        'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base',
                        (showErrors && formErrors.firstName) ? 'border-red-500' : 'border-black/25',
                        isFieldDisabled.firstName ? 'bg-gray-100' : 'bg-white'
                      ]"
                      :disabled="isFieldDisabled.firstName"
                    >
                    <span v-if="showErrors && formErrors.firstName" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.lastName') }}</label>
                    <input
                      type="text"
                      v-model="formData.lastName"
                      :placeholder="$t('checkout.lastNamePlaceholder')"
                      :class="[
                        'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base',
                        (showErrors && formErrors.lastName) ? 'border-red-500' : 'border-black/25',
                        isFieldDisabled.lastName ? 'bg-gray-100' : 'bg-white'
                      ]"
                      :disabled="isFieldDisabled.lastName"
                    >
                    <span v-if="showErrors && formErrors.lastName" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.email') }}</label>
                    <input
                      type="email"
                      v-model="formData.email"
                      :placeholder="$t('checkout.emailPlaceholder')"
                      :class="[
                        'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base',
                        (showErrors && formErrors.email) ? 'border-red-500' : 'border-black/25',
                        isFieldDisabled.email ? 'bg-gray-100' : 'bg-white'
                      ]"
                      :disabled="isFieldDisabled.email"
                    >
                    <span v-if="showErrors && formErrors.email" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.phone') }}</label>
                    <input
                      type="tel"
                      v-model="formData.phone"
                      :placeholder="$t('checkout.phonePlaceholder')"
                      :class="[
                        'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white',
                        (showErrors && formErrors.phone) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.phone" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                </div>
              </section>

              <!-- P.O. Number and Location Section -->
              <section>
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12">
                  <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl">{{ $t('checkout.poNumber') }}</h2>
                </div>
                <div class="mb-6">
                  <!-- P.O. Number -->
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.poNumber') }}</label>
                    <input
                      type="text"
                      v-model="formData.poNumber"
                      :placeholder="$t('checkout.poNumberPlaceholder')"
                      class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base"
                    >
                  </div>
                </div>



                <!-- Delivery Method -->
                <div class="mb-6">
                  <label class="block font-archivo text-sm mb-2">{{ $t('checkout.deliveryMethod') }}</label>
                  <div class="flex gap-3 md:gap-4">
                    <button
                      type="button"
                      @click="setDeliveryMethod('delivery')"
                      :class="[
                        'flex-1 px-4 py-2 md:px-6 md:py-3 font-archivo-narrow font-semibold text-base md:text-lg rounded',
                        deliveryMethod === 'delivery' ? 'bg-empire-yellow text-black' : 'bg-gray-300 text-black'
                      ]"
                    >
                      {{ $t('checkout.delivery') }}
                    </button>
                    <button
                      type="button"
                      @click="setDeliveryMethod('pickup')"
                      :class="[
                        'flex-1 px-4 py-2 md:px-6 md:py-3 font-archivo-narrow font-semibold text-base md:text-lg rounded',
                        deliveryMethod === 'pickup' ? 'bg-empire-yellow text-black' : 'bg-gray-300 text-black'
                      ]"
                    >
                      {{ $t('checkout.pickup') }}
                    </button>
                  </div>
                </div>
              </section>


              <!-- Shipping Address Section -->
              <section>
                <div class="flex items-center justify-between cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('shipping')">
                  <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl">{{ $t('checkout.shippingDetails') }}</h2>

                  <div class="flex items-center lg:absolute lg:right-0 lg:top-0">
                    <button
                      @click.stop="openAddressModal"
                      class="bg-empire-yellow text-black px-3 py-1.5 rounded text-sm font-archivo font-medium mr-4 hover:bg-empire-yellow/90 transition-colors"
                    >
                      {{ deliveryMethod === 'delivery' ? $t('checkout.changeAddress') : $t('checkout.changeLocation') }}
                    </button>

                    <!-- Seta para mobile -->
                    <svg
                      class="section-arrow lg:hidden ml-4 absolute right-0"
                      :class="{ 'rotate-270': sections.shipping }"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div v-show="sections.shipping || isDesktop">
                  <!-- Delivery Mode -->
                  <div v-if="deliveryMethod === 'delivery'" class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <!-- Linha 1: Address Line 1 -->
                    <div class="col-span-1 md:col-span-3">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.addressLine1') }}</label>
                      <input
                        type="text"
                        v-model="formData.address"
                        :placeholder="$t('checkout.addressLine1Placeholder')"
                        required
                        :class="[
                          'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white',
                          (showErrors && formErrors.address) ? 'border-red-500' : 'border-black/25'
                        ]"
                      >
                      <span v-if="showErrors && formErrors.address" class="text-red-500 text-sm mt-1">
                        {{ $t('checkout.fieldRequired') }}
                      </span>
                    </div>

                    <!-- Linha 2: Address Line 2 (antigo Landmark) -->
                    <div class="col-span-1 md:col-span-3">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.addressLine2') }}</label>
                      <input
                        type="text"
                        v-model="formData.landmark"
                        :placeholder="$t('checkout.addressLine2Placeholder')"
                        :class="[
                          'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white',
                          (showErrors && formErrors.landmark) ? 'border-red-500' : 'border-black/25'
                        ]"
                      >
                      <span v-if="showErrors && formErrors.landmark" class="text-red-500 text-sm mt-1">
                        {{ $t('checkout.fieldRequired') }}
                      </span>
                    </div>

                    <!-- Linha 3: Country e State -->
                    <div class="col-span-1 md:col-span-2">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.country') }}</label>
                      <CustomSelect
                        v-model="selectedCountryId"
                        :options="countryOptions"
                        :placeholder="$t('checkout.selectCountry')"
                        :error="showErrors && formErrors.country"
                        :error-message="$t('checkout.fieldRequired')"
                        required
                        @change="onCountryChange"
                      />
                    </div>

                    <div class="col-span-1 md:col-span-1">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.state') }}</label>
                      <CustomSelect
                        v-model="selectedProvinceId"
                        :options="provinceOptions"
                        :placeholder="$t('checkout.selectState')"
                        :disabled="!selectedCountryId"
                        :error="showErrors && formErrors.state"
                        :error-message="$t('checkout.fieldRequired')"
                        required
                        @change="onProvinceChange"
                      />
                    </div>

                    <!-- Linha 4: City e Postal Code -->
                    <div class="col-span-1 md:col-span-2">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.city') }}</label>
                      <input
                        type="text"
                        v-model="formData.city"
                        :placeholder="$t('checkout.cityPlaceholder')"
                        required
                        :class="[
                          'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white',
                          (showErrors && formErrors.city) ? 'border-red-500' : 'border-black/25'
                        ]"
                      >
                      <span v-if="showErrors && formErrors.city" class="text-red-500 text-sm mt-1">
                        {{ $t('checkout.fieldRequired') }}
                      </span>
                    </div>

                    <div class="col-span-1 md:col-span-1">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.postalCode') }}</label>
                      <input
                        type="text"
                        v-model="formData.postalCode"
                        :placeholder="$t('checkout.postalCodePlaceholder')"
                        required
                        :class="[
                          'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white',
                          (showErrors && formErrors.postalCode) ? 'border-red-500' : 'border-black/25'
                        ]"
                      >
                      <span v-if="showErrors && formErrors.postalCode" class="text-red-500 text-sm mt-1">
                        {{ $t('checkout.fieldRequired') }}
                      </span>
                    </div>

                    <!-- Linha 4: Contact on Site, Contact Phone, Delivery Date/Time -->
                    <div class="col-span-1 md:col-span-1">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.contactOnSite') }}</label>
                      <input
                        type="text"
                        v-model="formData.contactOnSite"
                        :placeholder="$t('checkout.contactOnSitePlaceholder')"
                        class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white"
                      >
                    </div>
                    <div class="col-span-1 md:col-span-1">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.contactPhone') }}</label>
                      <input
                        type="tel"
                        v-model="formData.contactPhone"
                        :placeholder="$t('checkout.contactPhonePlaceholder')"
                        class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white"
                      >
                    </div>
                    <div class="col-span-1 md:col-span-1">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.deliveryDate') }}</label>
                      <input
                        type="date"
                        v-model="formData.deliveryDate"
                        class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white"
                      >
                    </div>

                    <!-- Linha 5: Special Delivery Instructions -->
                    <div class="col-span-1 md:col-span-3">
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.specialInstructions') }}</label>
                      <textarea
                        v-model="formData.specialInstructions"
                        :placeholder="$t('checkout.specialInstructionsPlaceholder')"
                        rows="3"
                        class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white"
                      ></textarea>
                    </div>

                    <!-- Campos ocultos para compatibilidade com backend -->
                    <input type="hidden" v-model="formData.number">
                    <input type="hidden" v-model="formData.apartment">
                  </div>

                  <!-- Pick-up Mode -->
                  <div v-else class="space-y-4">
                    <!-- Location Information and Pickup Date - Desktop Layout -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <!-- Location Information - 3/4 columns on desktop -->
                      <div class="md:col-span-3">
                        <div class="bg-gray-100 p-4 rounded-lg h-full">
                          <div>
                            <h3 class="font-archivo-narrow font-semibold text-lg mb-2">{{ $t('checkout.pickupLocation') }}</h3>
                            <p class="font-archivo text-base">
                              {{ selectedLocation ? selectedLocation.description : $t('checkout.selectLocation') }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Pickup Date - 1/4 column on desktop -->
                      <div class="md:col-span-1">
                        <label class="block font-archivo text-sm mb-2">{{ $t('checkout.pickupDate') }}</label>
                        <input
                          type="date"
                          v-model="formData.deliveryDate"
                          class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white h-[calc(100%-2rem)]"
                        >
                      </div>
                    </div>

                    <!-- Special Delivery Instructions for Pickup -->
                    <div>
                      <label class="block font-archivo text-sm mb-2">{{ $t('checkout.specialInstructions') }}</label>
                      <textarea
                        v-model="formData.specialInstructions"
                        :placeholder="$t('checkout.specialInstructionsPlaceholder')"
                        rows="3"
                        class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Payment Section - Exibido apenas se o toggle master estiver habilitado -->
              <section v-if="showPrices">
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('payment')">
                  <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl">{{ $t('checkout.paymentDetails') }}</h2>

                  <!-- Bandeiras dos cartões -->
                  <div class="flex flex-wrap items-center gap-2 sm:gap-4 lg:ml-8">
                    <img src="/images/payment/visa.png" alt="Visa" class="h-6 sm:h-8">
                    <img src="/images/payment/master.png" alt="Mastercard" class="h-6 sm:h-8">
                    <img src="/images/payment/paypal.png" alt="PayPal" class="h-6 sm:h-8">
                    <img src="/images/payment/stripe.png" alt="Stripe" class="h-6 sm:h-8">
                    <img src="/images/payment/google.png" alt="Google Pay" class="h-6 sm:h-8">
                  </div>

                  <!-- Seta para mobile -->
                  <svg
                    class="section-arrow lg:hidden absolute right-0"
                    :class="{ 'rotate-270': sections.payment }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                  </svg>
                </div>
                <div v-show="sections.payment || isDesktop" class="grid grid-cols-2 gap-3 md:gap-4">
                  <div class="col-span-2">
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cardHolder') }}</label>
                    <input
                      type="text"
                      v-model="formData.cardHolder"
                      :placeholder="$t('checkout.cardHolderPlaceholder')"
                      class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div class="col-span-2">
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cardNumber') }}</label>
                    <input
                      type="text"
                      v-model="formData.cardNumber"
                      :placeholder="$t('checkout.cardNumberPlaceholder')"
                      class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.expiryDate') }}</label>
                    <input
                      type="text"
                      v-model="formData.expiryDate"
                      :placeholder="$t('checkout.expiryDatePlaceholder')"
                      class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cvv') }}</label>
                    <input
                      type="text"
                      v-model="formData.cvv"
                      :placeholder="$t('checkout.cvvPlaceholder')"
                      class="w-full p-2 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-gray-100"
                      disabled
                    >
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-4">
            <div class="w-full lg:w-[528px] bg-white">
              <div class="flex flex-col gap-3 md:gap-4 p-3 md:p-4">
                <!-- Header -->
                <div class="flex justify-center items-center w-full h-[50px] md:h-[72px] bg-[#FAFAFA]">
                  <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-[30px] md:leading-[40px] text-center mx-auto">{{ $t('checkout.summary.title') }}</h2>
                </div>

                <!-- Loading Spinner para o resumo do pedido -->
                <div v-if="isLoadingSummary" class="py-8 flex justify-center">
                  <LoadingSpinner :text="$t('checkout.processing')" />
                </div>

                <template v-else-if="cartItems.length > 0">
                  <!-- Products List -->
                  <div class="space-y-0">
                    <div v-for="(item, index) in cartItems" :key="index"
                      class="flex items-start py-4 md:py-8 border-b border-black/25">
                      <!-- Imagem do Produto -->
                      <router-link :to="`/product/${item.id}`">
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="w-[80px] h-[80px] md:w-[120px] md:h-[110px] object-contain"
                          @error="handleImageError"
                        />
                      </router-link>

                      <!-- Container para descrição, nome e preço -->
                      <div class="flex-1 min-w-0 mx-4"> <!-- min-w-0 permite que o texto seja truncado -->
                        <div class="flex flex-col gap-2">
                          <!-- Descrição do produto em negrito (invertida com o nome) -->
                          <div class="h-[2.4em] overflow-hidden">
                            <router-link :to="`/product/${item.id}`" class="hover:text-empire-yellow transition-colors">
                              <p class="font-archivo font-bold text-sm md:text-base leading-[1.2em] text-black/90 description-fixed-height">
                                {{ getProductDescription(item) }}
                              </p>
                            </router-link>
                          </div>

                          <!-- Nome do Produto com Quantidade -->
                          <div class="flex items-center gap-2 min-w-0"> <!-- min-w-0 permite que o texto seja truncado -->
                            <div class="flex-shrink-0 flex justify-center items-center w-[22px] h-[22px] bg-black">
                              <span class="font-archivo font-semibold text-xs text-empire-yellow">{{ item.quantity }}x</span>
                            </div>
                            <router-link :to="`/product/${item.id}`" class="font-archivo-narrow font-light text-[12px] md:text-[14px] leading-[14px] md:leading-[16px] text-black/70 truncate hover:text-empire-yellow transition-colors product-name">{{ item.name }}</router-link>
                          </div>

                          <!-- Características do produto -->
                          <div v-if="item.color || item.size || item.weight || item.unit" class="flex flex-col gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                            <span v-if="item.color" class="font-archivo text-sm text-black/70 flex items-center gap-2">
                              <span class="font-semibold">{{ $t('productDetails.selectColor') }}:</span>
                              <span class="flex items-center gap-2">
                                <span
                                  class="inline-block rounded-full border-2 transition-all duration-200"
                                  :style="{
                                    backgroundColor: item.color,
                                    borderColor: isWhiteOrLight(item.color) ? '#CCCCCC' : 'transparent',
                                    width: '14px',
                                    height: '14px'
                                  }"
                                  :class="[
                                    isWhiteOrLight(item.color) ? 'ring-1 ring-gray-200' : ''
                                  ]"
                                ></span>
                              </span>
                            </span>
                            <span v-if="item.size" class="font-archivo text-sm text-black/70">
                              <span class="font-semibold">{{ $t('productDetails.selectSize') }}:</span> {{ item.size }}
                            </span>
                            <span v-if="item.weight" class="font-archivo text-sm text-black/70">
                              <span class="font-semibold">{{ $t('productDetails.selectWeight') }}:</span> {{ item.weight }}
                            </span>
                            <span v-if="item.unit" class="font-archivo text-sm text-black/70">
                              <span class="font-semibold">{{ $t('productDetails.selectUnit') }}:</span> {{ item.unit }}
                            </span>
                          </div>

                          <!-- Preço (exibido apenas se o toggle master estiver habilitado) -->
                          <span v-if="showPrices" class="font-archivo text-base md:text-[22px] leading-[24px] md:leading-[40px] text-black/70">
                            {{ currencySymbol }}{{ (item.price * item.quantity).toFixed(2) }}
                          </span>
                        </div>
                      </div>

                      <!-- Botão de remover -->
                      <button
                        class="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
                        @click="removeItem(index)"
                      >
                        <svg width="24" height="24" class="md:w-8 md:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4L21.3333 8H10.6667L12 4H20Z" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M13.3333 13.3333V22.6667" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.6667 13.3333V22.6667" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Totals (exibidos apenas se o toggle master estiver habilitado) -->
                  <div v-if="showPrices" class="space-y-4">
                    <div class="flex justify-between">
                      <span class="font-archivo text-base md:text-[22px] leading-[24px] md:leading-[40px]">{{ $t('checkout.summary.taxes') }}</span>
                      <span class="font-archivo text-base md:text-[22px] leading-[24px] md:leading-[40px]">{{ currencySymbol }}{{ calculateTaxes }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-archivo text-base md:text-[22px] leading-[24px] md:leading-[40px]">
                        {{ $t('checkout.summary.shipping') }}
                        <span v-if="calculateShipping === '0.00'" class="text-green-600 text-xs md:text-sm ml-1 md:ml-2">
                          ({{ $t('checkout.summary.freeShipping') }})
                        </span>
                      </span>
                      <span class="font-archivo text-base md:text-[22px] leading-[24px] md:leading-[40px]">{{ currencySymbol }}{{ calculateShipping }}</span>
                    </div>
                    <div class="flex justify-between items-center py-4">
                      <span class="font-archivo-narrow font-semibold text-xl md:text-[34px] leading-[30px] md:leading-[40px] text-black/70">
                        {{ $t('checkout.summary.total') }}
                      </span>
                      <span class="font-archivo-narrow font-semibold text-xl md:text-[34px] leading-[30px] md:leading-[40px] text-black/70">
                        {{ currencySymbol }}{{ calculateTotal }}
                      </span>
                    </div>
                  </div>

                  <!-- Mensagem de valor mínimo de compra -->
                  <div v-if="minOrderValueEnabled && !isCheckoutButtonEnabled" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {{ minOrderValueMessage }}
                  </div>

                  <!-- Complete Purchase Button -->
                  <button
                    class="w-full py-3 md:py-4 font-archivo-narrow font-semibold text-xl md:text-[34px] leading-[40px] md:leading-[72px] text-center"
                    :class="{
                      'bg-empire-yellow': isCheckoutButtonEnabled,
                      'bg-gray-300 cursor-not-allowed': !isCheckoutButtonEnabled
                    }"
                    @click="completePurchase"
                    :disabled="!isCheckoutButtonEnabled"
                  >
                    {{ $t('checkout.completePurchase') }}
                  </button>
                </template>

                <template v-else>
                  <div class="flex flex-col items-center gap-6 py-8">
                    <p class="font-archivo-narrow font-semibold text-xl md:text-2xl text-center">{{ $t('checkout.emptyCart') }}</p>
                    <button
                      class="bg-empire-yellow px-6 md:px-8 py-3 md:py-4 font-archivo-narrow font-semibold text-lg md:text-2xl"
                      @click="continueShopping"
                    >
                      {{ $t('checkout.continueShopping') }}
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AddressSelectionModal
    :show="showAddressModal"
    :current-address-id="currentAddressId"
    :is-pickup-mode="deliveryMethod === 'pickup'"
    :current-location-id="selectedLocationId"
    @close="showAddressModal = false"
    @select="updateShippingAddress"
    @selectLocation="updateSelectedLocation"
  />



  <!-- Modal de Confirmação de Projeto -->
  <ProjectConfirmationModal
    :show="showProjectModal"
    @close="closeProjectModal"
    @confirm="confirmProjectAndProceed"
    @change-project="handleProjectChange"
  />
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useI18n } from 'vue-i18n'
import AddressSelectionModal from '@/components/address/AddressSelectionModal.vue'
import ProjectConfirmationModal from '@/components/checkout/ProjectConfirmationModal.vue'
import { useAddressStore } from '@/stores/addressStore'
import { settingsService } from '@/services/settingsService'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { imageService } from '@/services/imageService' // Para usar o handleImageError
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { projectService } from '@/services/projectService'
import { locationService } from '@/services/locationService'
import { productService } from '@/services/productService'
import { geographyService } from '@/services/geographyService'
import CustomSelect from '@/components/CustomSelect.vue'

export default {
  name: 'CheckoutPage',
  components: {
    AddressSelectionModal,
    ProjectConfirmationModal,
    LoadingSpinner,
    CustomSelect
  },
  setup() {
    const cartStore = useCartStore()
    const store = useStore()
    const router = useRouter()
    const { t, locale } = useI18n()
    const addressStore = useAddressStore()
    const checkoutStore = useCheckoutStore()
    const currencySymbol = ref('$')
    const taxRate = ref(0)
    const shippingCost = ref(0)
    const freeShippingThreshold = ref(0)
    const minOrderValue = ref(0) // Valor mínimo de compra
    const minOrderValueEnabled = ref(false) // Status do toggle de valor mínimo
    const togglesStore = useFinancialTogglesStore()
    const showPrices = ref(true) // Controla a visibilidade dos preços
    const loading = ref(true) // Estado de carregamento principal
    const summaryLoading = ref(true) // Estado de carregamento do resumo
    const error = ref(null) // Estado de erro
    const productDescriptions = ref({}) // Armazena as descrições dos produtos

    const loadFinancialSettings = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol
        taxRate.value = parseFloat(settings.tax_rate || 0)
        shippingCost.value = parseFloat(settings.shipping_cost || 0)
        freeShippingThreshold.value = parseFloat(settings.free_shipping_threshold || 0)
        minOrderValue.value = parseFloat(settings.min_order_value || 0) // Valor mínimo de compra como número
        minOrderValueEnabled.value = settings.min_order_value_enabled || false // Status do toggle

        // Carrega o estado dos toggles
        togglesStore.loadTogglesFromBackend({
          currency_code_enabled: settings.currency_code_enabled,
          currency_symbol_enabled: settings.currency_symbol_enabled,
          tax_rate_enabled: settings.tax_rate_enabled,
          discount_percentage_enabled: settings.discount_percentage_enabled,
          min_order_value_enabled: settings.min_order_value_enabled,
          free_shipping_threshold_enabled: settings.free_shipping_threshold_enabled,
          shipping_cost_enabled: settings.shipping_cost_enabled,
          master_toggle_enabled: settings.master_toggle_enabled
        })

        // Atualiza a visibilidade dos preços com base no toggle master
        showPrices.value = togglesStore.masterToggle
        // Atualiza o status do toggle de valor mínimo
        minOrderValueEnabled.value = settings.min_order_value_enabled
        console.log('Master toggle state:', togglesStore.masterToggle)
        console.log('Show prices:', showPrices.value)
        console.log('Min order value (raw):', settings.min_order_value)
        console.log('Min order value (ref):', minOrderValue.value)
        console.log('Min order value type:', typeof minOrderValue.value)
        console.log('Min order value enabled:', minOrderValueEnabled.value)
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Removido onMounted aqui, pois agora está em loadCheckoutData

    const calculateTaxes = computed(() => {
      const subtotalValue = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
      return (subtotalValue * (taxRate.value / 100)).toFixed(2)
    })

    const calculateShipping = computed(() => {
      const subtotalValue = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)

      // Se o valor total for maior que o limite para frete grátis, retorna 0
      if (subtotalValue >= freeShippingThreshold.value) {
        return '0.00'
      }

      // Converte para número e formata com 2 casas decimais
      return Number(shippingCost.value).toFixed(2)
    })

    // Adicionar computed para dados do usuário
    const userData = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })

    const cartItems = computed(() => cartStore.items)

    const continueShopping = () => {
      router.push('/categories')
    }

    const removeItem = (index) => {
      cartStore.removeItem(index)
    }

    // Variável ref para controlar o estado de loading do resumo no setup
    const isLoadingSummaryRef = ref(true)

    // Função para carregar as descrições dos produtos no carrinho
    const loadProductDescriptions = async () => {
      try {
        if (cartStore.items.length > 0) {
          console.log('Loading descriptions for', cartStore.items.length, 'items');

          // Cria uma cópia dos itens para modificação
          const updatedItems = [...cartStore.items];
          let hasUpdates = false;

          for (let i = 0; i < updatedItems.length; i++) {
            const item = updatedItems[i];
            console.log('Processing item:', item.id, item.name);

            // Verifica se já temos a descrição em cache
            if (productDescriptions.value[item.id]) {
              console.log('Description already in cache for item', item.id);
              // Adiciona a descrição diretamente ao item
              if (!item.description) {
                updatedItems[i] = {
                  ...item,
                  description: productDescriptions.value[item.id]
                };
                hasUpdates = true;
              }
              continue;
            }

            try {
              console.log('Fetching product details for item', item.id);
              const productDetails = await productService.getProductDetails(item.id);

              if (productDetails) {
                // Seleciona a descrição no idioma atual ou usa fallback para inglês
                const description = productDetails[`description_${locale.value}`] ||
                                   productDetails.description_en ||
                                   productDetails.description_fr ||
                                   '';

                console.log('Got description for item', item.id, ':', description);

                // Armazena no cache
                productDescriptions.value[item.id] = description;

                // Adiciona a descrição diretamente ao item
                updatedItems[i] = {
                  ...item,
                  description: description
                };
                hasUpdates = true;
              }
            } catch (err) {
              console.error('Error fetching product details for item', item.id, ':', err);
            }
          }

          // Se houve atualizações, atualiza os itens no carrinho
          if (hasUpdates) {
            console.log('Updating cart items with descriptions');

            // Atualiza os itens no store
            for (let i = 0; i < updatedItems.length; i++) {
              if (updatedItems[i].description && !cartStore.items[i].description) {
                console.log(`Adding description to item ${i} (${updatedItems[i].id}): ${updatedItems[i].description.substring(0, 30)}...`);
                // Atualiza a descrição no item original
                cartStore.items[i].description = updatedItems[i].description;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading product descriptions:', error);
      }
    }

    // Observa mudanças nos itens do carrinho para carregar descrições
    watch(() => cartStore.items.length, () => {
      if (cartStore.items.length > 0) {
        loadProductDescriptions()
      }
    })

    // Observa mudanças no idioma para atualizar as descrições
    watch(locale, () => {
      if (Object.keys(productDescriptions.value).length > 0) {
        loadProductDescriptions()
      }
    })

    const loadCheckoutData = async () => {
      try {
        console.log('Iniciando carregamento de dados do checkout')
        // Definir os estados de loading como true
        loading.value = true
        summaryLoading.value = true
        isLoadingSummaryRef.value = true
        error.value = null

        // Adicionando um pequeno atraso para garantir que o loading seja exibido
        await new Promise(resolve => setTimeout(resolve, 300))

        // Carrega as configurações financeiras
        await loadFinancialSettings()

        // Carrega os endereços do usuário
        await addressStore.fetchAddresses()

        // Carrega as descrições dos produtos
        await loadProductDescriptions()

        console.log('Dados básicos carregados, desativando loading principal')
        // Desativa o loading principal após carregar os dados básicos
        loading.value = false

        console.log('Desativando loading do resumo')
        // Desativa o loading do resumo imediatamente
        summaryLoading.value = false
        isLoadingSummaryRef.value = false
      } catch (err) {
        console.error('Error loading checkout data:', err)
        error.value = 'Failed to load checkout data'
        loading.value = false
        summaryLoading.value = false
        isLoadingSummaryRef.value = false
      }
    }

    // Carrega os dados ao montar o componente
    onMounted(async () => {
      console.log('🚀 Iniciando carregamento dos dados do checkout...');
      await loadCheckoutData()
      console.log('✅ Dados do checkout carregados');

      // Aguarda um pouco e depois emite evento para carregar endereço padrão
      setTimeout(() => {
        console.log('⏰ Emitindo evento para carregar endereço padrão...');
        window.dispatchEvent(new CustomEvent('loadDefaultAddressNow'));
      }, 1000);
    })

    return {
      cartStore,
      store,
      router, // Importante: passar o router para os methods
      continueShopping,
      cartItems,
      removeItem,
      t,
      userData,
      addressStore,
      currencySymbol,
      calculateTaxes,
      calculateShipping,
      checkoutStore,
      showPrices,
      minOrderValue,
      minOrderValueEnabled,
      loading,
      summaryLoading,
      error,
      loadCheckoutData,
      // Expor a função loadFinancialSettings para uso nos methods
      loadFinancialSettings,
      // Expor a variável isLoadingSummaryRef para sincronização com isLoadingSummary
      isLoadingSummaryRef,
      // Expor as descrições dos produtos
      productDescriptions
    }
  },
  data() {
    // Inicializar formData com dados do usuário se disponível
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return {
      sections: {
        personal: true,
        shipping: true,
        payment: true
      },
      isDesktop: window.innerWidth >= 1024,
      deliveryMethod: 'delivery', // Default para entrega
      companyData: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      companyContacts: [],
      selectedCompanyAddressId: '',
      selectedCompanyAddress: null,
      locations: [], // Lista de locais disponíveis
      selectedLocationId: '', // ID do local selecionado
      formData: {
        poNumber: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '', // Telefone do usuário
        address: '', // Address Line 1
        number: '', // Mantido para compatibilidade com backend
        landmark: '', // Novo campo: Ponto de referência (substitui neighborhood)
        apartment: '', // Mantido para compatibilidade com backend
        city: '',
        state: '',
        postalCode: '',
        country: '',
        contactOnSite: '', // Novo campo: Contato no local
        contactPhone: '', // Novo campo: Telefone de contato no local
        deliveryDate: '', // Novo campo: Data de entrega/retirada
        specialInstructions: '', // Novo campo: Instruções especiais de entrega
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      showErrors: false,
      /* eslint-disable vue/no-dupe-keys */
      error: null,
      showErrorAlert: false,
      /* eslint-enable vue/no-dupe-keys */
      showAddressModal: false,
      currentAddressId: null,
      showProjectModal: false,
      selectedLocation: null, // Objeto do local selecionado
      selectedShippingAddressId: null, // ID do endereço de entrega selecionado
      isLoadingSummary: true, // Estado de carregamento para o resumo do pedido
      // Dados de geografia
      countries: [], // Lista de países
      provinces: [], // Lista de estados/províncias
      selectedCountryId: null, // ID do país selecionado
      selectedProvinceId: null // ID do estado/província selecionado
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    formErrors() {
      const errors = {}

      if (this.deliveryMethod === 'delivery') {
        // Campos obrigatórios para delivery
        const deliveryRequiredFields = [
          'address',        // Address line 1
          'country',        // Country
          'state',          // State
          'city',           // City
          'postalCode'      // Postal Code
        ]

        deliveryRequiredFields.forEach(field => {
          errors[field] = !this.formData[field]
        })

        console.log('🚚 Validação delivery - campos obrigatórios:', {
          address: !!this.formData.address,
          country: !!this.formData.country,
          state: !!this.formData.state,
          city: !!this.formData.city,
          postalCode: !!this.formData.postalCode
        })
      } else if (this.deliveryMethod === 'pickup') {
        // Para pickup: apenas local selecionado é obrigatório
        errors.location = !this.selectedLocationId
        console.log('🏪 Validação pickup - local obrigatório:', {
          selectedLocationId: this.selectedLocationId,
          hasLocationError: errors.location
        })
      }

      return errors
    },
    hasErrors() {
      return Object.values(this.formErrors).some(error => error)
    },
    // Adicionar computed properties para verificar se campos devem estar desabilitados
    isFieldDisabled() {
      return {
        firstName: !!this.userData?.firstName,
        lastName: !!this.userData?.lastName,
        email: !!this.userData?.email
        // Não incluímos o telefone aqui para que ele permaneça editável
      }
    },
    calculateTotal() {
      const subtotalValue = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      const taxesValue = parseFloat(this.calculateTaxes)
      const shippingValue = parseFloat(this.calculateShipping)

      return (subtotalValue + taxesValue + shippingValue).toFixed(2)
    },
    // Verifica se o botão de finalizar pedido deve estar habilitado
    isCheckoutButtonEnabled() {
      // Se o toggle de valor mínimo estiver desabilitado, o botão deve estar habilitado
      if (!this.minOrderValueEnabled) {
        console.log('Min order value toggle disabled, button enabled');
        return true;
      }

      // Se o toggle estiver habilitado, verifica se o valor total é maior que o valor mínimo
      const totalValue = parseFloat(this.calculateTotal);
      const minValue = parseFloat(this.minOrderValue);

      console.log('Checkout validation:', {
        totalValue,
        minValue,
        isEnabled: totalValue >= minValue
      });

      return totalValue >= minValue;
    },
    // Mensagem de valor mínimo para exibir ao usuário
    minOrderValueMessage() {
      if (this.minOrderValueEnabled && this.minOrderValue > 0) {
        // Converter para número antes de chamar toFixed
        const minValue = parseFloat(this.minOrderValue);
        return this.$t('checkout.minOrderValueMessage', { value: `${this.currencySymbol}${minValue.toFixed(2)}` });
      }
      return '';
    },
    // Opções formatadas para o combobox de países
    countryOptions() {
      return this.countries.map(country => ({
        value: country.id,
        label: country.cdesc
      }));
    },
    // Opções formatadas para o combobox de estados
    provinceOptions() {
      return this.provinces.map(province => ({
        value: province.id,
        label: province.cdesc
      }));
    }
  },
  async mounted() {
    window.addEventListener('resize', this.checkDesktop)

    // Criar referência para o handler do evento
    this.handleLoadDefaultAddress = () => {
      console.log('📨 Evento loadDefaultAddressNow recebido');

      if (this.deliveryMethod === 'delivery') {
        console.log('🚚 Modo delivery ativo, carregando endereço padrão...');
        this.loadDefaultAddress();
      } else {
        console.log('❌ Não está no modo delivery');
      }
    };

    // Listener para carregar endereço padrão
    window.addEventListener('loadDefaultAddressNow', this.handleLoadDefaultAddress);

    // Carregar países ao montar o componente
    this.loadCountries();

    // Não precisamos mais definir os estados de loading aqui,
    // pois eles já são definidos no loadCheckoutData
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDesktop)
    window.removeEventListener('loadDefaultAddressNow', this.handleLoadDefaultAddress)
  },
  methods: {
    // Métodos para controlar os estados de loading
    setLoading(value) {
      // Atualiza diretamente a variável loading do setup se disponível
      try {
        if (this.$setup && this.$setup.loading) {
          this.$setup.loading.value = value;
        }
      } catch (err) {
        console.warn('Não foi possível acessar loading do setup:', err);
      }
    },
    setSummaryLoading(value) {
      // Atualiza diretamente a variável summaryLoading do setup se disponível
      try {
        if (this.$setup && this.$setup.summaryLoading) {
          this.$setup.summaryLoading.value = value;
        }

        // Atualiza também isLoadingSummaryRef se disponível
        if (this.$setup && this.$setup.isLoadingSummaryRef) {
          this.$setup.isLoadingSummaryRef.value = value;
        }
      } catch (err) {
        console.warn('Não foi possível acessar variáveis de loading do setup:', err);
      }

      // Atualiza diretamente a variável isLoadingSummary para garantir sincronização
      this.isLoadingSummary = value;
    },
    handleImageError(e) {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    },
    // Método para obter a descrição do produto
    getProductDescription(item) {
      if (!item) {
        console.warn('Item is undefined or null');
        return '-';
      }

      console.log('Getting description for item:', item.id);

      // Primeiro, verifica se o item já tem a descrição
      if (item.description) {
        console.log('Using item description:', item.description);
        return item.description;
      }

      // Depois, verifica se temos a descrição no cache
      if (this.productDescriptions && this.productDescriptions[item.id]) {
        console.log('Found description in cache:', this.productDescriptions[item.id]);
        return this.productDescriptions[item.id];
      }

      // Se não tiver descrição, retorna o nome do produto como fallback
      console.log('Falling back to item name:', item.name);
      return item.name || '-';
    },
    isWhiteOrLight(color) {
      if (!color || color === 'transparent') return false;

      // Cores claras conhecidas
      const lightColors = ['#ffffff', '#fff', 'white', 'branco', '#f5f5f5', '#fafafa', '#f0f0f0', '#eeeeee', '#e0e0e0', 'lightgray', 'lightgrey'];
      if (lightColors.includes(color.toLowerCase())) {
        return true;
      }

      // Tenta extrair os componentes RGB
      let r, g, b;

      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          // Formato abreviado #RGB
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          // Formato completo #RRGGBB
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
      } else if (color.startsWith('rgb')) {
        // Formato rgb(r,g,b) ou rgba(r,g,b,a)
        const rgbValues = color.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          [r, g, b] = rgbValues.map(Number);
        }
      }

      // Se conseguiu extrair os componentes RGB, calcula a luminosidade
      if (r !== undefined && g !== undefined && b !== undefined) {
        // Fórmula YIQ para determinar a luminosidade
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128; // Valor de corte para cores claras
      }

      // Se não conseguiu determinar, assume que não é clara
      return false;
    },
    openAddressModal() {
      // Primeiro, calculamos a posição desejada
      const windowHeight = window.innerHeight;
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = scrollPosition + (windowHeight * 0.2); // 20% da altura da janela

      // Fazemos o scroll suave
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Abrimos o modal após um pequeno delay para dar tempo do scroll terminar
      setTimeout(() => {
        this.showAddressModal = true;
      }, 300);
    },


    // Método para definir o modo de entrega
    setDeliveryMethod(method) {
      console.log('🔄 Mudando modo de entrega para:', method);
      this.deliveryMethod = method;

      // Se mudar para pickup, carrega os locais disponíveis
      if (method === 'pickup') {
        console.log('📦 Modo pickup selecionado, carregando locais...');
        // Carrega os locais disponíveis
        if (this.locations.length === 0) {
          this.loadLocations();
        }
        // Limpa os campos de endereço quando mudar para pickup
        this.clearAddressFields();
      } else if (method === 'delivery') {
        console.log('🚚 Modo delivery selecionado, carregando endereço padrão...');
        // Se mudar para delivery, carrega o endereço padrão se disponível
        setTimeout(() => {
          this.loadDefaultAddress();
        }, 100); // Pequeno delay para garantir que a mudança foi processada
      }
    },

    // Método para carregar os locais disponíveis
    async loadLocations() {
      try {
        const locations = await locationService.getLocations();
        this.locations = locations;
        console.log('Locais carregados:', locations);

        // Se não houver local selecionado e houver locais disponíveis, seleciona o primeiro
        if (!this.selectedLocationId && locations.length > 0) {
          this.selectedLocationId = locations[0].id;
          this.selectedLocation = locations[0];
          console.log('🏪 Local selecionado automaticamente:', {
            id: this.selectedLocationId,
            name: this.selectedLocation.name
          });
        } else {
          console.log('🏪 Estado dos locais:', {
            selectedLocationId: this.selectedLocationId,
            locationsCount: locations.length,
            hasSelectedLocation: !!this.selectedLocationId
          });
        }
      } catch (error) {
        console.error('Erro ao carregar locais:', error);
        this.$toast.error(this.$t('checkout.errorLoadingLocations'));
      }
    },

    // Método para carregar países
    async loadCountries() {
      try {
        console.log('🌍 Carregando países...');
        const countries = await geographyService.getCountries();
        this.countries = countries;
        console.log('Países carregados:', countries);
      } catch (error) {
        console.error('Erro ao carregar países:', error);
        this.$toast.error(this.$t('checkout.errorLoadingCountries'));
      }
    },

    // Método para carregar estados/províncias de um país
    async loadProvinces(countryId) {
      try {
        console.log('🏛️ Carregando estados para país:', countryId);
        const provinces = await geographyService.getProvincesByCountry(countryId);
        this.provinces = provinces;
        console.log('Estados carregados:', provinces);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
        this.$toast.error(this.$t('checkout.errorLoadingStates'));
      }
    },

    // Método chamado quando o país é alterado
    async onCountryChange(countryId) {
      console.log('🔄 País alterado para:', countryId);

      // Atualiza o ID selecionado
      this.selectedCountryId = countryId;

      // Limpa o estado selecionado
      this.selectedProvinceId = null;
      this.formData.state = '';
      this.provinces = [];

      if (countryId) {
        // Busca o país selecionado e atualiza o formData
        const selectedCountry = this.countries.find(c => c.id === countryId);
        if (selectedCountry) {
          this.formData.country = selectedCountry.cdesc;
          console.log('País selecionado:', selectedCountry.cdesc);
        }

        // Carrega os estados do país selecionado
        await this.loadProvinces(countryId);
      } else {
        this.formData.country = '';
      }
    },

    // Método chamado quando o estado é alterado
    onProvinceChange(provinceId) {
      console.log('🔄 Estado alterado para:', provinceId);

      // Atualiza o ID selecionado
      this.selectedProvinceId = provinceId;

      if (provinceId) {
        // Busca o estado selecionado e atualiza o formData
        const selectedProvince = this.provinces.find(p => p.id === provinceId);
        if (selectedProvince) {
          this.formData.state = selectedProvince.cdesc;
          console.log('Estado selecionado:', selectedProvince.cdesc);
        }
      } else {
        this.formData.state = '';
      }
    },

    // Método para carregar o endereço padrão
    async loadDefaultAddress() {
      try {
        console.log('🔄 Iniciando carregamento do endereço padrão...');
        console.log('📍 Modo de entrega atual:', this.deliveryMethod);

        // Só carrega se estiver no modo delivery
        if (this.deliveryMethod !== 'delivery') {
          console.log('❌ Não está no modo delivery, cancelando carregamento');
          return;
        }

        // Garante que os endereços sejam carregados primeiro
        if (!this.addressStore.addresses || this.addressStore.addresses.length === 0) {
          console.log('📦 Endereços não carregados, carregando agora...');
          await this.addressStore.fetchAddresses();
        }

        // Garante que os países estejam carregados
        if (!this.countries || this.countries.length === 0) {
          console.log('🌍 Países não carregados, carregando agora...');
          await this.loadCountries();
        }

        // Busca o endereço padrão (is_default = true)
        const addresses = this.addressStore.addresses;
        console.log('📋 Total de endereços disponíveis:', addresses.length);
        console.log('📋 Endereços completos:', JSON.stringify(addresses, null, 2));

        // Tenta encontrar por is_default = true primeiro
        let defaultAddress = addresses.find(addr => addr.is_default === true);

        // Se não encontrar, tenta por isDefault = true (compatibilidade)
        if (!defaultAddress) {
          defaultAddress = addresses.find(addr => addr.isDefault === true);
        }

        console.log('🎯 Endereço padrão encontrado:', defaultAddress);

        if (defaultAddress) {
          console.log('✅ Preenchendo formulário com endereço padrão...');

          // Preenche o formulário com os dados do endereço padrão
          this.formData.address = defaultAddress.address_line_1 || '';
          this.formData.landmark = defaultAddress.address_line_2 || '';
          this.formData.city = defaultAddress.city || '';
          this.formData.postalCode = defaultAddress.postal_code || '';

          // Busca e seleciona o país pelo nome
          if (defaultAddress.country) {
            console.log('🔍 Buscando país pelo nome:', defaultAddress.country);
            const country = this.countries.find(c => c.cdesc === defaultAddress.country);
            if (country) {
              console.log('✅ País encontrado:', country);
              this.selectedCountryId = country.id;
              this.formData.country = country.cdesc;

              // Carrega os estados do país e depois busca o estado
              await this.loadProvinces(country.id);

              // Busca e seleciona o estado pelo nome
              if (defaultAddress.state) {
                console.log('🔍 Buscando estado pelo nome:', defaultAddress.state);
                const province = this.provinces.find(p => p.cdesc === defaultAddress.state);
                if (province) {
                  console.log('✅ Estado encontrado:', province);
                  this.selectedProvinceId = province.id;
                  this.formData.state = province.cdesc;
                } else {
                  console.log('❌ Estado não encontrado:', defaultAddress.state);
                  this.formData.state = defaultAddress.state; // Mantém o nome original
                }
              }
            } else {
              console.log('❌ País não encontrado:', defaultAddress.country);
              this.formData.country = defaultAddress.country; // Mantém o nome original
            }
          }

          // Salva o ID do endereço selecionado
          this.selectedShippingAddressId = defaultAddress.id;
          this.currentAddressId = defaultAddress.id;

          console.log('📝 Dados preenchidos no formulário:');
          console.log('   - Address:', this.formData.address);
          console.log('   - Landmark:', this.formData.landmark);
          console.log('   - City:', this.formData.city);
          console.log('   - State:', this.formData.state);
          console.log('   - Postal Code:', this.formData.postalCode);
          console.log('   - Country:', this.formData.country);
          console.log('   - Selected Country ID:', this.selectedCountryId);
          console.log('   - Selected Province ID:', this.selectedProvinceId);
          console.log('✅ Formulário preenchido com sucesso!');

          // Força a reatividade do Vue
          this.$forceUpdate();
        } else {
          console.log('❌ Nenhum endereço padrão encontrado');
          console.log('🧹 Limpando campos de endereço...');
          this.clearAddressFields();
        }
      } catch (error) {
        console.error('❌ Erro ao carregar endereço padrão:', error);
      }
    },

    // Método para limpar os campos de endereço
    clearAddressFields() {
      this.formData.address = '';
      this.formData.landmark = '';
      this.formData.city = '';
      this.formData.state = '';
      this.formData.postalCode = '';
      this.formData.country = '';
      this.selectedShippingAddressId = null;
      this.currentAddressId = null;
      this.selectedCountryId = null;
      this.selectedProvinceId = null;
      this.provinces = []; // Limpa a lista de estados
    },



    // Método para atualizar o local selecionado
    updateSelectedLocation(location) {
      this.selectedLocationId = location.id;
      this.selectedLocation = location;
      console.log('Local selecionado:', location);

      // Fechar o modal após a seleção
      this.showAddressModal = false;
    },

    // Método para carregar os dados da empresa
    async loadCompanyData() {
      try {
        const response = await api.get('/settings/company');
        this.companyData = {
          name: response.data.company_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || ''
        };

        // Mapeia os contatos para o formato correto
        this.companyContacts = (response.data.contacts || []).map(contact => ({
          id: contact.id,
          name: contact.name,
          department: contact.department,
          email: contact.email,
          phone: contact.phone,
          address: contact.address
        }));
      } catch (err) {
        console.error('Error loading company data:', err);
        this.$toast.error(this.$t('contact.loadError'));
      }
    },

    // Método para atualizar o endereço da empresa selecionado
    updateSelectedCompanyAddress() {
      if (this.selectedCompanyAddressId === 'main') {
        this.selectedCompanyAddress = {
          name: this.companyData.name,
          address: this.companyData.address
        };
      } else if (this.selectedCompanyAddressId) {
        const contact = this.companyContacts.find(c => c.id === this.selectedCompanyAddressId);
        if (contact) {
          this.selectedCompanyAddress = {
            name: contact.name,
            address: contact.address
          };
        }
      } else {
        this.selectedCompanyAddress = null;
      }
    },

    toggleSection(section) {
      if (!this.isDesktop) {
        this.sections[section] = !this.sections[section]
      }
    },
    checkDesktop() {
      this.isDesktop = window.innerWidth >= 1024
    },
    validateForm() {
      console.log('🔍 Iniciando validação do formulário');
      this.showErrors = true

      console.log('📋 Método de entrega:', this.deliveryMethod);
      console.log('📋 Erros do formulário:', this.formErrors);
      console.log('📋 hasErrors:', this.hasErrors);

      const isValid = !this.hasErrors;
      console.log('✅ Formulário válido:', isValid);

      return isValid;
    },
    async completePurchase() {
      console.log('🚀 completePurchase iniciado');

      try {
        // Verifica se o botão está habilitado
        console.log('🔍 Verificando se botão está habilitado:', this.isCheckoutButtonEnabled);
        if (!this.isCheckoutButtonEnabled) {
          console.log('❌ Botão não está habilitado, saindo');
          return;
        }

        // Valida o formulário
        console.log('🔍 Validando formulário...');
        const isFormValid = this.validateForm();
        console.log('📋 Resultado da validação:', isFormValid);

        if (!isFormValid) {
          console.log('❌ Formulário inválido, saindo');
          return;
        }

        // Verifica a quantidade de projetos do usuário (regra igual para todos os perfis)
        try {
          console.log('🔍 Buscando projetos do usuário...');
          // Busca os projetos do usuário
          const userProjects = await projectService.getCurrentUserProjects();
          console.log('📋 Projetos encontrados:', userProjects);

          if (userProjects.length === 0) {
            // Se não tiver projetos, finaliza sem projeto
            console.log('⚠️ Usuário não tem projetos, finalizando sem projeto');
            this.confirmProjectAndProceed({ id: null, name: null });
            return;
          } else if (userProjects.length === 1) {
            // Se tiver apenas um projeto, finaliza com esse projeto
            console.log('✅ Usuário tem apenas um projeto, finalizando pedido com esse projeto:', userProjects[0]);
            const project = {
              id: userProjects[0].id,
              name: userProjects[0].name || userProjects[0].nome
            };

            // Salva o projeto no sessionStorage
            projectService.saveSelectedProject(project);

            // Finaliza o pedido com esse projeto
            this.confirmProjectAndProceed(project);
            return;
          } else {
            // Se tiver múltiplos projetos, mostra o modal (para todos os perfis)
            console.log('📋 Usuário tem múltiplos projetos, mostrando modal');
          }
        } catch (error) {
          console.error('❌ Erro ao buscar projetos do usuário:', error);
          // Em caso de erro, mostra o modal normalmente para permitir seleção manual
          console.log('🔄 Continuando para mostrar modal devido ao erro');
        }

        // Se não for nenhum dos casos acima, mostra o modal de confirmação de projeto
        console.log('📋 Mostrando modal de confirmação de projeto');
        this.showProjectModal = true;
        console.log('✅ Modal de projeto definido como true:', this.showProjectModal);

      } catch (error) {
        console.error('❌ Erro inesperado em completePurchase:', error);
        // Mostra uma mensagem de erro para o usuário
        this.$toast.error(this.$t('checkout.errorProcessingOrder'));
      }
    },

    closeProjectModal() {
      this.showProjectModal = false;

      // Se o modal foi fechado, verificar se há projetos disponíveis
      // Se não houver projetos, finalizar o pedido com project_id: null
      const storedProject = sessionStorage.getItem('selectedProject');
      if (!storedProject) {
        // Finalizar o pedido com project_id: null
        this.confirmProjectAndProceed({ id: null, name: null });
      }
    },

    handleProjectChange(project) {
      console.log('Projeto alterado:', project);
      // O projeto já foi salvo no localStorage pelo componente do modal
    },

    async confirmProjectAndProceed(project) {
      this.showProjectModal = false;
      console.log('Iniciando processamento do pedido');
      this.setLoading(true); // Ativar o loading global
      this.setSummaryLoading(true); // Ativar o loading do resumo
      this.error = null;

      try {
        // Sincroniza o carrinho com o backend
        await this.cartStore.syncCartWithBackend();

        // Atualiza o telefone do usuário se fornecido
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id && this.formData.phone) {
          try {
            const response = await api.patch(`/users/${user.id}`, {
              firstName: user.firstName,
              lastName: user.lastName,
              phone: this.formData.phone
            });

            // Atualiza os dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify({
              ...user,
              ...response.data
            }));
          } catch (error) {
            console.error('Error updating user phone:', error);
            // Continua com o checkout mesmo se falhar a atualização do telefone
          }
        }

        // Usar o ID do endereço selecionado se estivermos no modo delivery
        let shippingAddressId = null;

        if (this.deliveryMethod === 'delivery') {
          // Se o usuário selecionou um endereço existente, usamos o ID diretamente
          if (this.selectedShippingAddressId) {
            shippingAddressId = this.selectedShippingAddressId;
            console.log('Usando endereço existente com ID:', shippingAddressId);
          } else {
            console.log('Nenhum endereço selecionado, usando os dados do formulário sem salvar na tabela shipping_address');
          }
        }

        // Preparamos os dados para o backend
        // Lógica diferenciada para pickup vs delivery
        const orderData = {
          poNumber: this.formData.poNumber, // Número de PO
          deliveryMethod: this.deliveryMethod,
          notes: this.checkoutStore.orderNotes,
          // Se o toggle master estiver desabilitado, envia valores null
          shippingCost: this.showPrices ? parseFloat(this.calculateShipping) : null,
          taxAmount: this.showPrices ? parseFloat(this.calculateTaxes) : null,
          // Adiciona o ID do projeto selecionado (pode ser null)
          project_id: project ? project.id : null,
          // Adiciona o campo neovation_order (sempre null)
          neovation_order: null,
          specialInstructions: this.formData.specialInstructions || null, // Disponível para ambos os métodos
        };

        // Lógica específica para cada método de entrega
        if (this.deliveryMethod === 'pickup') {
          // Para pickup: apenas location_id, sem dados de endereço
          orderData.location_id = this.selectedLocationId;
          orderData.address = null;
          orderData.landmark = null;
          orderData.city = null;
          orderData.postalCode = null;
          orderData.shipping_address_id = null;
          orderData.contactOnSite = null;
          orderData.contactPhone = null;
          // Separar data e hora - sempre enviar hora como null
          orderData.delivery_date = this.formData.deliveryDate || null;
          orderData.delivery_time = null;
        } else if (this.deliveryMethod === 'delivery') {
          // Para delivery: dados de endereço e shipping_address_id se selecionado
          orderData.location_id = null;
          orderData.address = this.formData.address;
          orderData.landmark = this.formData.landmark || null;
          orderData.city = this.formData.city;
          orderData.state = this.formData.state || null;
          orderData.postalCode = this.formData.postalCode;
          orderData.country = this.formData.country || null;
          // Incluir IDs de país e estado
          orderData.country_id = this.selectedCountryId || null;
          orderData.state_id = this.selectedProvinceId || null;
          orderData.shipping_address_id = shippingAddressId; // ID do endereço selecionado ou null
          orderData.contactOnSite = this.formData.contactOnSite || null;
          orderData.contactPhone = this.formData.contactPhone || null;
          // Separar data e hora - sempre enviar hora como null
          orderData.delivery_date = this.formData.deliveryDate || null;
          orderData.delivery_time = null;
        }

        // Mantemos o objeto metadata para compatibilidade com código existente
        orderData.metadata = {};

        console.log('Order data being sent:', orderData);

        const response = await api.post('/orders', orderData);

        if (response.data && response.data.order_number) {
          await this.cartStore.clearCart();
          this.checkoutStore.clearCheckoutData();

          await this.router.push({
            name: 'ThankYou',
            params: { orderNumber: response.data.order_number }
          });
        } else {
          throw new Error('Order number not received from server');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        this.error = this.$t('checkout.errorProcessingOrder');
        this.showErrorAlert = true;
      } finally {
        console.log('Finalizando processamento do pedido');
        this.setLoading(false); // Desativar o loading global
        this.setSummaryLoading(false); // Desativar o loading do resumo
        console.log('Estado final do loading do resumo:', this.isLoadingSummary);
      }
    },
    updateShippingAddress(address) {
      // Preencher automaticamente os campos de endereço quando o usuário selecionar um endereço
      // Usando a nova estrutura simplificada
      this.formData.address = address.address_line_1
      this.formData.landmark = address.address_line_2 || ''
      this.formData.city = address.city
      this.formData.state = address.state || ''
      this.formData.postalCode = address.postal_code
      this.formData.country = address.country || ''

      // Armazenar o ID do endereço selecionado
      this.currentAddressId = address.id

      // Armazenar o ID do endereço para usar diretamente no pedido
      this.selectedShippingAddressId = address.id

      // Fechar o modal após a seleção
      this.showAddressModal = false
    }
  },
  watch: {
    // Adicionar watcher para atualizar campos quando userData mudar
    userData: {
      handler(newUserData) {
        if (newUserData) {
          this.formData.firstName = newUserData.firstName || this.formData.firstName
          this.formData.lastName = newUserData.lastName || this.formData.lastName
          this.formData.email = newUserData.email || this.formData.email
          this.formData.phone = newUserData.phone || this.formData.phone // Adicionar atualização do telefone
        }
      },
      immediate: true
    },
    // Watcher para sincronizar isLoadingSummaryRef com isLoadingSummary
    '$setup.isLoadingSummaryRef': {
      handler(newValue) {
        console.log('isLoadingSummaryRef mudou para:', newValue)
        this.isLoadingSummary = newValue
      },
      immediate: true
    },
    // Watcher para atualizar o endereço selecionado quando o ID mudar
    selectedCompanyAddressId: {
      handler(newValue) {
        if (newValue) {
          this.updateSelectedCompanyAddress()
        }
      }
    }
  },
  async beforeRouteEnter(_, __, next) {
    const cartStore = useCartStore();

    if (!cartStore.items.length) {
      next('/shopping-cart');
    } else {
      next();
    }
  },
  async created() {
    // Não carregamos os endereços aqui, pois já estão sendo carregados no loadCheckoutData
    try {
      // Comentado temporariamente - não preencher automaticamente os campos de endereço
      // Será usado no futuro quando reativarmos essa funcionalidade
      /*
      const defaultAddress = this.addressStore.addresses.find(addr => addr.isDefault)

      if (defaultAddress) {
        this.formData.address = defaultAddress.address
        this.formData.number = defaultAddress.number // Adicionado number
        this.formData.neighborhood = defaultAddress.neighborhood // Adicionado neighborhood
        this.formData.apartment = defaultAddress.apartment
        this.formData.city = defaultAddress.city
        this.formData.state = defaultAddress.state
        this.formData.postalCode = defaultAddress.postalCode
        this.formData.country = defaultAddress.country
        this.currentAddressId = defaultAddress.id
      }
      */

      // Carrega os dados da empresa para o modo pickup
      this.loadCompanyData();
    } catch (error) {
      console.error('Error loading default address:', error)
      this.$toast.error(this.$t('checkout.errorLoadingAddress'))
    }
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: white;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

/* Estilização da barra de rolagem */
.overflow-y-auto {
  scrollbar-width: 8px;
  scrollbar-color: #FFDD00 #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #FFDD00;
}

/* Mobile Summary */
.lg\\:hidden {
  display: none;
}

@media (max-width: 1023px) {
  .lg\\:hidden {
    display: block;
  }
}

.section-arrow {
  margin: 0 auto;
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.rotate-270 {
  transform: rotate(270deg);
}

@media (min-width: 1024px) {
  .section-arrow {
    display: none;
  }
}

@media (max-width: 1023px) {
  .mobile-address-btn {
    background-color: #FFCD29; /* empire-yellow */
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .mobile-address-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  .mobile-address-btn {
    background-color: #FFCD29;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
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
