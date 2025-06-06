<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-hidden"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      aria-hidden="true"
      @click="close"
    ></div>

    <!-- Modal container with max height -->
    <div class="flex items-center justify-center h-full">
      <!-- Modal panel -->
      <div
        class="relative bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl overflow-hidden"
        style="max-height: 80vh;"
      >
        <!-- Modal content with scrollable area -->
        <div class="flex flex-col h-full relative">
          <div class="px-4 pt-5 pb-4 sm:p-6 overflow-y-auto" style="max-height: calc(80vh - 80px);">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="font-archivo-narrow font-semibold text-2xl">
                    {{ isPickupMode ? $t('checkout.selectLocation') : $t('checkout.selectAddress') }}
                  </h3>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-empire-yellow"></div>
                </div>

                <!-- Empty state for addresses -->
                <div v-else-if="!isPickupMode && addresses.length === 0" class="text-center py-8">
                  <p class="text-gray-500">{{ $t('addresses.noAddresses') }}</p>
                </div>

                <!-- Empty state for locations -->
                <div v-else-if="isPickupMode && locations.length === 0" class="text-center py-8">
                  <p class="text-gray-500">{{ $t('checkout.noLocationsFound') }}</p>
                </div>

                <!-- Address list -->
                <div v-else-if="!isPickupMode">
                  <div class="space-y-4 pb-8">
                    <div
                      v-for="address in addresses"
                      :key="address.id"
                      class="border rounded-lg p-4 transition-all duration-200"
                      :class="[
                        selectedAddressId === address.id
                          ? 'border-empire-yellow bg-empire-yellow/10'
                          : 'border-black/25 hover:border-black/50'
                      ]"
                      @click="selectAddress(address)"
                    >
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div
                            v-if="address.isDefault"
                            class="inline-block bg-empire-yellow px-2 py-1 text-xs font-archivo mb-2"
                          >
                            {{ $t('addresses.default') }}
                          </div>

                          <div class="font-archivo space-y-1">
                            <p>{{ address.address_line_1 }}</p>
                            <p v-if="address.address_line_2">{{ address.address_line_2 }}</p>
                            <p>{{ address.city }} {{ address.postal_code }}</p>
                          </div>
                        </div>

                        <div
                          class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                          :class="[
                            selectedAddressId === address.id
                              ? 'border-empire-yellow'
                              : 'border-black/25'
                          ]"
                        >
                          <div
                            v-if="selectedAddressId === address.id"
                            class="w-3 h-3 rounded-full bg-empire-yellow"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Locations list -->
                <div v-else-if="isPickupMode">
                  <div class="space-y-4 pb-8">
                    <div
                      v-for="location in locations"
                      :key="location.id"
                      class="border rounded-lg p-4 transition-all duration-200"
                      :class="[
                        selectedLocationId === location.id
                          ? 'border-empire-yellow bg-empire-yellow/10'
                          : 'border-black/25 hover:border-black/50'
                      ]"
                      @click="selectLocation(location)"
                    >
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div class="font-archivo space-y-1">
                            <p class="font-medium text-base">{{ location.description }}</p>
                          </div>
                        </div>

                        <div
                          class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                          :class="[
                            selectedLocationId === location.id
                              ? 'border-empire-yellow'
                              : 'border-black/25'
                          ]"
                        >
                          <div
                            v-if="selectedLocationId === location.id"
                            class="w-3 h-3 rounded-full bg-empire-yellow"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse mt-auto sticky bottom-0 border-t border-gray-200 shadow-md z-10">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-empire-yellow font-medium text-black hover:bg-empire-yellow/90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              @click="confirmSelection"
            >
              {{ isPickupMode ? $t('checkout.useThisLocation') : $t('checkout.useThisAddress') }}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm font-archivo"
              @click="close"
              style="min-width: 80px;"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { locationService } from '@/services/locationService'

export default {
  name: 'AddressSelectionModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    currentAddressId: {
      type: String,
      default: null
    },
    isPickupMode: {
      type: Boolean,
      default: false
    },
    currentLocationId: {
      type: String,
      default: null
    }
  },

  setup(props) {
    const router = useRouter()
    const selectedAddressId = ref(props.currentAddressId)
    const selectedAddressData = ref(null)
    const selectedLocationId = ref(props.currentLocationId)
    const selectedLocationData = ref(null)
    const addresses = ref([])
    const locations = ref([])
    const loading = ref(false)

    // Função para buscar endereços
    const fetchAddresses = async () => {
      if (props.isPickupMode) return; // Não busca endereços no modo pickup

      loading.value = true
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) throw new Error('User not found')

        const response = await api.get(`/users/${user.id}/addresses`)
        addresses.value = response.data.map(addr => ({
          id: addr.id,
          address_line_1: addr.address_line_1 || addr.address, // Compatibilidade com estrutura antiga
          address_line_2: addr.address_line_2 || addr.landmark || '',
          city: addr.city,
          postal_code: addr.postal_code,
          isDefault: addr.is_default
        }))

        // Se não houver endereço selecionado, seleciona o padrão
        if (!selectedAddressId.value) {
          const defaultAddress = addresses.value.find(addr => addr.isDefault)
          if (defaultAddress) {
            selectedAddressId.value = defaultAddress.id
            selectedAddressData.value = defaultAddress
          }
        } else {
          // Se já existe um endereço selecionado, mantém a seleção
          selectedAddressData.value = addresses.value.find(addr => addr.id === selectedAddressId.value)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      } finally {
        loading.value = false
      }
    }

    // Função para buscar locais
    const fetchLocations = async () => {
      if (!props.isPickupMode) return; // Não busca locais no modo normal

      loading.value = true
      try {
        const locationsData = await locationService.getLocations()
        locations.value = locationsData

        // Se não houver local selecionado e houver locais disponíveis, seleciona o primeiro
        if (!selectedLocationId.value && locationsData.length > 0) {
          selectedLocationId.value = locationsData[0].id
          selectedLocationData.value = locationsData[0]
        } else if (selectedLocationId.value) {
          // Se já existe um local selecionado, mantém a seleção
          selectedLocationData.value = locationsData.find(loc => loc.id === selectedLocationId.value)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        loading.value = false
      }
    }

    // Observar mudanças no currentAddressId
    watch(() => props.currentAddressId, (newId) => {
      if (newId && !props.isPickupMode) {
        selectedAddressId.value = newId
        selectedAddressData.value = addresses.value.find(addr => addr.id === newId)
      }
    })

    // Observar mudanças no currentLocationId
    watch(() => props.currentLocationId, (newId) => {
      if (newId && props.isPickupMode) {
        selectedLocationId.value = newId
        selectedLocationData.value = locations.value.find(loc => loc.id === newId)
      }
    })

    // Observar mudanças no isPickupMode
    watch(() => props.isPickupMode, (isPickup) => {
      if (props.show) {
        if (isPickup) {
          fetchLocations()
        } else {
          fetchAddresses()
        }
      }
    })

    // Carregar dados quando o modal for aberto
    watch(() => props.show, (newValue) => {
      if (newValue) {
        document.body.style.overflow = 'hidden'
        if (props.isPickupMode) {
          fetchLocations()
        } else {
          fetchAddresses()
        }
      } else {
        document.body.style.overflow = ''
      }
    })

    onMounted(() => {
      if (props.show) {
        if (props.isPickupMode) {
          fetchLocations()
        } else {
          fetchAddresses()
        }
      }
    })

    return {
      router,
      selectedAddressId,
      selectedAddressData,
      selectedLocationId,
      selectedLocationData,
      addresses,
      locations,
      loading,
      fetchLocations
    }
  },

  methods: {
    close() {
      this.$emit('close')
    },

    selectAddress(address) {
      this.selectedAddressId = address.id
      this.selectedAddressData = address
    },

    selectLocation(location) {
      this.selectedLocationId = location.id
      this.selectedLocationData = location
    },

    confirmSelection() {
      if (this.isPickupMode && this.selectedLocationData) {
        this.$emit('selectLocation', this.selectedLocationData)
        this.close()
      } else if (!this.isPickupMode && this.selectedAddressData) {
        this.$emit('select', this.selectedAddressData)
        this.close()
      }
    },

    goToAddresses() {
      this.router.push('/addresses')
    }
  },

  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* Estilização da barra de rolagem */
.overflow-y-auto {
  scrollbar-width: thin;
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
</style>
