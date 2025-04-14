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
            <span class="text-black">{{ $t('content.homeImages.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('content.homeImages.title') }}
          </h1>         
        </div>

        <!-- Form -->
        <div class="bg-[#FAFAFA] p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.title') }}</label>
              <input 
                type="text"
                v-model="formData.title"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                :placeholder="$t('content.homeImages.form.titlePlaceholder')"
              />
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.description') }}</label>
              <textarea 
                v-model="formData.description"
                rows="4"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none resize-none"
                :placeholder="$t('content.homeImages.form.descriptionPlaceholder')"
              ></textarea>
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.image') }}</label>
              <div class="relative">
                <input 
                  type="file"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="hidden"
                  ref="fileInput"
                />
                <div class="flex items-center gap-3">
                  <button 
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    {{ $t('content.homeImages.form.chooseFileButton') }}
                  </button>
                  <span class="text-gray-600">
                    {{ selectedFileName || $t('content.homeImages.form.noFileSelected') }}
                  </span>
                  <button 
                    v-if="selectedFileName"
                    type="button"
                    @click="removeSelectedImage"
                    class="hover:opacity-70 transition-opacity p-1 rounded-full"
                    :title="$t('content.homeImages.form.removeImage')"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-black/50 mt-2">{{ $t('content.homeImages.form.imageHint') }}</p>
            </div>

            <div class="flex justify-end gap-4">
              <router-link
                to="/settings/content"
                class="px-8 py-4 rounded text-black font-semibold bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {{ $t('content.homeImages.form.cancel') }}
              </router-link>
              <button 
                type="submit"
                class="bg-empire-yellow px-8 py-4 rounded text-black font-semibold hover:bg-empire-yellow/90 transition-colors"
                :disabled="loading"
              >
                {{ $t(editingId ? 'content.homeImages.form.update' : 'content.homeImages.form.add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'
import { createToaster } from "@meforma/vue-toaster"

const toast = createToaster()
const { t } = useI18n()
const loading = ref(false)
const selectedFileName = ref('')
const fileInput = ref(null)

const formData = ref({
  title: '',
  description: '',
  image: null,
  is_active: true
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!validateImage(file)) {
      event.target.value = ''
      return
    }

    selectedFileName.value = file.name
    formData.value.image = file
  } else {
    selectedFileName.value = ''
    formData.value.image = null
  }
}

const removeSelectedImage = () => {
  selectedFileName.value = ''
  formData.value.image = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    image: null,
    is_active: true
  }
  selectedFileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!formData.value.title.trim()) {
    toast.error(t('content.homeImages.errors.titleRequired'))
    return
  }

  if (!formData.value.description.trim()) {
    toast.error(t('content.homeImages.errors.descriptionRequired'))
    return
  }

  if (!formData.value.image) {
    toast.error(t('content.homeImages.errors.imageRequired'))
    return
  }

  loading.value = true

  try {
    const formDataToSend = new FormData()
    
    formDataToSend.append('title', formData.value.title.trim())
    formDataToSend.append('description', formData.value.description.trim())
    formDataToSend.append('image', formData.value.image)
    formDataToSend.append('is_active', formData.value.is_active.toString())
    formDataToSend.append('folder', 'banner') // Adiciona informação da pasta

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await api.post('/settings/home-images', formDataToSend, config)
    
    if (response.data) {
      toast.success(t('content.homeImages.success.imageUploaded'))
      resetForm()
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    
    // Mostrar mensagem de erro específica do servidor se disponível
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.response?.status === 413) {
      toast.error(t('content.homeImages.errors.fileTooLarge'))
    } else if (error.response?.status === 415) {
      toast.error(t('content.homeImages.errors.invalidFileType'))
    } else if (error.response?.status === 422) {
      toast.error(t('content.homeImages.errors.validationError'))
    } else {
      toast.error(t('content.homeImages.errors.uploadFailed'))
    }
  } finally {
    loading.value = false
  }
}

// Função auxiliar para verificar o tipo e tamanho da imagem
const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (file.size > maxSize) {
    toast.error(t('content.homeImages.errors.fileTooLarge'))
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    toast.error(t('content.homeImages.errors.invalidFileType'))
    return false;
  }

  return true;
}

onMounted(() => {
  // Inicialização necessária
})
</script>


