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
            <span class="text-black">{{ $t('systemSettings.company') }}</span>
          </nav>
        </div>

        <!-- Form -->
        <div class="max-w-[754px] mx-auto">
          <!-- Header -->
          <div class="mb-6 md:mb-8">
            <h1 class="font-archivo-narrow font-semibold text-2xl sm:text-[34px] leading-8 sm:leading-[40px]">
              {{ $t('systemSettings.company') }}
            </h1>
          </div>

          <!-- Loading state -->
          <div v-if="loading && !formData.name" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>

          <!-- Form content -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
            <!-- Nome da Empresa -->
            <div>
              <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('company.name') }}</label>
              <input
                type="text"
                v-model="formData.name"
                :placeholder="$t('company.namePlaceholder')"
                :class="[
                  'w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300',
                  (showErrors && !formData.name) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.name" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Email -->
            <div>
              <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('company.email') }}</label>
              <input
                type="email"
                v-model="formData.email"
                :placeholder="$t('company.emailPlaceholder')"
                :class="[
                  'w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300',
                  (showErrors && !formData.email) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.email" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Telefone -->
            <div>
              <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('company.phone') }}</label>
              <input
                type="tel"
                v-model="formData.phone"
                :placeholder="$t('company.phonePlaceholder')"
                :class="[
                  'w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300',
                  (showErrors && !formData.phone) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.phone" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Endereço -->
            <div>
              <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('company.address') }}</label>
              <input
                type="text"
                v-model="formData.address"
                :placeholder="$t('company.addressPlaceholder')"
                :class="[
                  'w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300',
                  (showErrors && !formData.address) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.address" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Seção de Contatos -->
            <div class="mt-4 md:mt-6">
              <div class="flex justify-between items-center mb-3 md:mb-4">
                <h3 class="font-archivo text-base md:text-lg">{{ $t('company.contacts.sectionTitle') }}</h3>
                <button
                  type="button"
                  @click="openContactsModal"
                  class="px-3 md:px-4 py-1 md:py-2 bg-empire-yellow text-black rounded-md hover:bg-empire-yellow/90 transition-colors flex items-center font-archivo text-xs md:text-sm"
                >
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {{ $t('company.contacts.manage') }}
                </button>
              </div>

              <!-- Lista de contatos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div
                  v-for="(contact, index) in contacts"
                  :key="index"
                  class="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                >
                  <!-- Barra superior decorativa -->
                  <div class="h-2 bg-empire-yellow rounded-t-xl"></div>

                  <!-- Conteúdo -->
                  <div class="p-3 md:p-6">
                    <!-- Ações -->
                    <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 rounded-lg p-1">
                      <button
                        type="button"
                        @click="editContact(index)"
                        class="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        :title="$t('common.edit')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteContact(index)"
                        class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        :title="$t('common.delete')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <!-- Informações do Contato -->
                    <div class="space-y-4">
                      <!-- Nome e Departamento -->
                      <div>
                        <h3 class="font-archivo-narrow text-lg md:text-xl font-semibold text-gray-900">
                          {{ contact.name }}
                        </h3>
                        <span class="inline-block mt-1 px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 text-gray-700 text-xs md:text-sm rounded-full">
                          {{ contact.department }}
                        </span>
                      </div>

                      <!-- Informações de Contato -->
                      <div class="space-y-3">
                        <!-- Email -->
                        <div class="flex items-center gap-3 text-gray-600">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <a
                            :href="`mailto:${contact.email}`"
                            class="text-gray-600 hover:text-empire-yellow transition-colors"
                          >
                            {{ contact.email }}
                          </a>
                        </div>

                        <!-- Telefone -->
                        <div class="flex items-center gap-3 text-gray-600">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                          <a
                            :href="`tel:${contact.phone}`"
                            class="text-gray-600 hover:text-empire-yellow transition-colors"
                          >
                            {{ contact.phone }}
                          </a>
                        </div>

                        <!-- Endereço -->
                        <div v-if="contact.address" class="flex items-center gap-3 text-gray-600">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          <span>{{ contact.address }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botões -->
            <div class="flex gap-2 md:gap-4 mt-6 md:mt-8">
              <button
                type="submit"
                class="flex-1 bg-empire-yellow text-black font-archivo font-semibold py-2 md:py-4 px-4 md:px-8 text-sm md:text-base hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                {{ loading ? $t('company.saving') : $t('company.save') }}
              </button>
              <button
                type="button"
                @click="goBack"
                class="flex-1 bg-gray-200 text-black font-archivo font-semibold py-2 md:py-4 px-4 md:px-8 text-sm md:text-base hover:bg-gray-300 transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de Contatos -->
  <CompanyContactsModal
    v-if="showContactsModal"
    :show="showContactsModal"
    :contacts="contacts"
    @close="showContactsModal = false"
    @update:contacts="updateContacts"
    ref="contactsModal"
  />
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCurrentInstance } from 'vue'
import api from '@/services/api'
import eventBus from '@/utils/eventBus'
import CompanyContactsModal from '@/components/modals/CompanyContactsModal.vue'

const router = useRouter()
const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const loading = ref(false)
const error = ref(null)
const showErrors = ref(false)
const showContactsModal = ref(false)
const contacts = ref([])
const contactsModal = ref(null)

// Carrega os dados iniciais
const loadCompanyData = async () => {
  try {
    const response = await api.get('/settings/company')
    formData.value = {
      name: response.data.company_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      address: response.data.address || ''
    }
    contacts.value = response.data.contacts || []
  } catch (err) {
    console.error('Error loading company data:', err)
    toast.error(t('company.loadError'))
  }
}

// Atualiza a lista de contatos localmente
const updateContacts = (newContacts) => {
  contacts.value = newContacts
}

// Abre o modal para edição
const editContact = (index) => {
  showContactsModal.value = true
  nextTick(() => {
    contactsModal.value?.startEdit(index)
  })
}

// Abre o modal para exclusão
const deleteContact = (index) => {
  showContactsModal.value = true
  nextTick(() => {
    contactsModal.value?.startDelete(index)
  })
}

// Abre o modal para adicionar novo contato
const openContactsModal = () => {
  showContactsModal.value = true
}

const handleSubmit = async () => {
  showErrors.value = true

  if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.address) {
    toast.error(t('company.requiredFieldsError'))
    return
  }

  loading.value = true
  error.value = null

  try {
    const dataToSubmit = {
      company_name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,
      contacts: contacts.value.map(contact => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address
      }))
    }

    await api.put('/settings/company', dataToSubmit)
    toast.success(t('company.updateSuccess'))
    eventBus.emit('company-data-updated')
  } catch (err) {
    console.error('Error updating company settings:', err)
    toast.error(t('company.updateError'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/settings')
}

onMounted(() => {
  loadCompanyData()
})
</script>
























