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
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings/content" class="hover:text-black">
              {{ $t('systemSettings.content') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('content.suppliers.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('content.suppliers.title') }}
          </h1>
        </div>

        <!-- Form -->
        <div class="bg-[#FAFAFA] p-8 mb-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.suppliers.form.title') }}</label>
              <input 
                type="text"
                v-model="formData.title"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                :placeholder="$t('content.suppliers.form.titlePlaceholder')"
              />
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.suppliers.form.text') }}</label>
              <textarea 
                v-model="formData.text"
                rows="4"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none resize-none"
                :placeholder="$t('content.suppliers.form.textPlaceholder')"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button 
                type="submit"
                class="bg-black text-empire-yellow px-8 py-3 font-archivo-narrow text-lg hover:opacity-90 transition-opacity"
              >
                {{ $t('content.suppliers.form.add') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Cards -->
        <div class="space-y-6">
          <div 
            v-for="(item, index) in supplierItems" 
            :key="index"
            class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg relative"
            :class="{ 'opacity-50': !item.visible }"
          >
            <!-- Botões de ação -->
            <div class="absolute top-4 right-4 flex gap-4">
              <button 
                @click="toggleVisibility(index)"
                class="hover:opacity-70 transition-opacity"
                :title="item.visible ? $t('content.suppliers.actions.hide') : $t('content.suppliers.actions.show')"
              >
                <svg 
                  class="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path 
                    v-if="item.visible"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path 
                    v-if="item.visible"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                  />
                  <path 
                    v-else
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                  />
                  <line 
                    v-if="!item.visible"
                    x1="1" 
                    y1="1" 
                    x2="23" 
                    y2="23"
                  />
                </svg>
              </button>

              <button 
                @click="editItem(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t('content.suppliers.actions.edit')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button 
                @click="deleteItem(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t('content.suppliers.actions.delete')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>

            <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ item.title }}</h2>
            <p class="text-black">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formData = ref({
  title: '',
  text: ''
})

const supplierItems = ref([
  {
    title: 'Fornecedor A',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    visible: true
  },
  {
    title: 'Fornecedor B',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    visible: true
  },
  {
    title: 'Fornecedor C',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    visible: true
  }
])

const handleSubmit = () => {
  if (formData.value.title && formData.value.text) {
    supplierItems.value.push({
      title: formData.value.title,
      text: formData.value.text,
      visible: true
    })
    formData.value = { title: '', text: '' }
  }
}

const toggleVisibility = (index) => {
  supplierItems.value[index].visible = !supplierItems.value[index].visible
}

const editItem = (index) => {
  formData.value = { ...supplierItems.value[index] }
  supplierItems.value.splice(index, 1)
}

const deleteItem = (index) => {
  if (confirm(t('content.suppliers.confirmDelete'))) {
    supplierItems.value.splice(index, 1)
  }
}
</script>
