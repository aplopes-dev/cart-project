<template>
  <!-- Modal principal -->
  <div v-if="show && !showDeleteConfirmation" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="flex items-center justify-center h-full translate-y-[-10%]">
      <div class="relative bg-white w-full max-w-3xl mx-4 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100">
            <div class="flex justify-between items-center">
              <h3 class="font-archivo-narrow font-semibold text-xl md:text-2xl text-gray-900">
                {{ isEditing ? $t('company.contacts.edit') : $t('company.contacts.add') }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="sr-only">{{ $t('common.close') }}</span>
              </button>
            </div>
          </div>

          <!-- Formulário de contato -->
          <div class="px-4 md:px-8 py-4 md:py-6">
            <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <!-- Nome -->
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {{ $t('company.contacts.name') }}
                  </label>
                  <input
                    v-model="contactForm.name"
                    type="text"
                    class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base h-9 md:h-auto rounded-lg border border-gray-300 focus:border-empire-yellow focus:ring-2 focus:ring-empire-yellow/20 transition-all outline-none"
                    required
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {{ $t('company.contacts.email') }}
                  </label>
                  <input
                    v-model="contactForm.email"
                    type="email"
                    class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base h-9 md:h-auto rounded-lg border border-gray-300 focus:border-empire-yellow focus:ring-2 focus:ring-empire-yellow/20 transition-all outline-none"
                    required
                  >
                </div>

                <!-- Telefone -->
                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {{ $t('company.contacts.phone') }}
                  </label>
                  <input
                    v-model="contactForm.phone"
                    type="tel"
                    class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base h-9 md:h-auto rounded-lg border border-gray-300 focus:border-empire-yellow focus:ring-2 focus:ring-empire-yellow/20 transition-all outline-none"
                    required
                  >
                </div>

                <!-- Website -->
                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {{ $t('company.contacts.website') }}
                  </label>
                  <input
                    v-model="contactForm.website"
                    type="text"
                    class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base h-9 md:h-auto rounded-lg border border-gray-300 focus:border-empire-yellow focus:ring-2 focus:ring-empire-yellow/20 transition-all outline-none"
                  >
                  <span class="text-xs text-gray-500 mt-1 block">{{ $t('company.websiteHint') }}</span>
                </div>

                <!-- Endereço -->
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {{ $t('company.contacts.address') }}
                  </label>
                  <input
                    v-model="contactForm.address"
                    type="text"
                    class="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base h-9 md:h-auto rounded-lg border border-gray-300 focus:border-empire-yellow focus:ring-2 focus:ring-empire-yellow/20 transition-all outline-none"
                    required
                  >
                </div>
              </div>

              <!-- Botões do formulário -->
              <div class="flex justify-end gap-2 md:gap-4 mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm bg-empire-yellow text-black rounded-lg hover:bg-empire-yellow/90 transition-colors font-medium"
                >
                  {{ isEditing ? $t('common.save') : $t('company.contacts.add') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão -->
  <div
    v-if="showDeleteConfirmation"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="flex items-center justify-center h-full translate-y-[-10%]">
      <div class="bg-white rounded-xl p-5 md:p-8 max-w-md w-full mx-4 shadow-2xl">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4 md:mb-6">
          <div class="flex items-center gap-4">
            <div class="bg-red-100 rounded-full p-2 md:p-3">
              <svg
                class="w-5 h-5 md:w-6 md:h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg md:text-xl font-archivo-narrow font-semibold text-gray-900">
                {{ $t('company.contacts.deleteConfirmation') }}
              </h3>
              <p class="mt-1 md:mt-2 text-xs md:text-sm text-gray-500">
                {{ $t('company.contacts.deleteWarning') }}
              </p>
            </div>
          </div>
          <button
            @click="cancelDelete"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Ações -->
        <div class="flex justify-end gap-2 md:gap-3 mt-4 md:mt-8 pt-3 md:pt-6 border-t border-gray-100">
          <button
            @click="cancelDelete"
            class="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-1 md:gap-2"
          >
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="confirmDelete"
            class="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-1 md:gap-2"
          >
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  contacts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'update:contacts'])

const isEditing = ref(false)
const editingIndex = ref(-1)
const showDeleteConfirmation = ref(false)
const deleteIndex = ref(-1)

const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  address: ''
})

const resetForm = () => {
  contactForm.name = ''
  contactForm.email = ''
  contactForm.phone = ''
  contactForm.website = ''
  contactForm.address = ''
  isEditing.value = false
  editingIndex.value = -1
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  const contact = {
    name: contactForm.name,
    email: contactForm.email,
    phone: contactForm.phone,
    website: contactForm.website,
    address: contactForm.address
  }

  if (isEditing.value) {
    const updatedContacts = [...props.contacts]
    updatedContacts[editingIndex.value] = contact
    emit('update:contacts', updatedContacts)
  } else {
    emit('update:contacts', [...props.contacts, contact])
  }

  resetForm()
  emit('close')
}

const startEdit = (index) => {
  const contact = props.contacts[index]
  isEditing.value = true
  editingIndex.value = index
  Object.assign(contactForm, contact)
}

const startDelete = (index) => {
  deleteIndex.value = index
  showDeleteConfirmation.value = true
}

const confirmDelete = () => {
  const updatedContacts = props.contacts.filter((_, index) => index !== deleteIndex.value)
  emit('update:contacts', updatedContacts)
  showDeleteConfirmation.value = false
  deleteIndex.value = -1
  emit('close')
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  deleteIndex.value = -1
}

defineExpose({
  startEdit,
  startDelete
})
</script>

<style scoped>
.translate-y-[-10%] {
  transform: translateY(-10%);
}
</style>







