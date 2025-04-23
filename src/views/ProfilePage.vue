<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[768px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-4 md:mb-8">
          <nav class="flex items-center gap-1 md:gap-2 font-archivo text-xs md:text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('profile.title') }}</span>
          </nav>
        </div>

        <!-- Título -->
        <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-8 md:leading-[40px] mb-4 md:mb-8">
          {{ $t('profile.title') }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
          <!-- Nome -->
          <div>
            <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('profile.firstName') }}</label>
            <input
              type="text"
              v-model="formData.firstName"
              :placeholder="$t('profile.firstNamePlaceholder')"
              :class="[
                'w-full p-3 md:p-4 border border-gray-300 text-sm md:text-base h-10 md:h-auto',
                (showErrors && !formData.firstName) ? 'border-red-500' : ''
              ]"
            >
            <span v-if="showErrors && !formData.firstName" class="text-red-500 text-xs md:text-sm mt-1">
              {{ $t('profile.fieldRequired') }}
            </span>
          </div>

          <!-- Sobrenome -->
          <div>
            <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('profile.lastName') }}</label>
            <input
              type="text"
              v-model="formData.lastName"
              :placeholder="$t('profile.lastNamePlaceholder')"
              :class="[
                'w-full p-3 md:p-4 border border-gray-300 text-sm md:text-base h-10 md:h-auto',
                (showErrors && !formData.lastName) ? 'border-red-500' : ''
              ]"
            >
            <span v-if="showErrors && !formData.lastName" class="text-red-500 text-xs md:text-sm mt-1">
              {{ $t('profile.fieldRequired') }}
            </span>
          </div>

          <!-- Email (Desabilitado) -->
          <div>
            <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('profile.email') }}</label>
            <input
              type="email"
              v-model="formData.email"
              disabled
              class="w-full p-3 md:p-4 border border-gray-300 bg-gray-100 text-sm md:text-base h-10 md:h-auto"
            >
            <p class="text-xs md:text-sm text-black/50 mt-1">{{ $t('profile.emailNotEditable') }}</p>
          </div>

          <!-- Telefone -->
          <div>
            <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('profile.phone') }}</label>
            <input
              type="tel"
              v-model="formData.phone"
              :placeholder="$t('profile.phonePlaceholder')"
              class="w-full p-3 md:p-4 border border-gray-300 text-sm md:text-base h-10 md:h-auto"
            >
          </div>

          <!-- Botões -->
          <div class="flex gap-2 md:gap-4 pt-2 md:pt-4">
            <!-- Botão Salvar -->
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-empire-yellow py-2 md:py-4 flex justify-center items-center"
            >
              <span class="font-archivo-narrow font-semibold text-sm md:text-base lg:text-[20px] leading-[20px] md:leading-[24px] text-black">
                {{ loading ? $t('profile.saving') : $t('profile.save') }}
              </span>
            </button>

            <!-- Botão Cancelar -->
            <button
              type="button"
              @click="goBack"
              class="flex-1 bg-gray-200 text-black font-archivo font-semibold py-2 md:py-4 flex justify-center items-center hover:bg-gray-300 transition-colors"
            >
              <span class="text-sm md:text-base lg:text-[20px] leading-[20px] md:leading-[24px]">
                {{ $t('profile.cancel') }}
              </span>
            </button>
          </div>

          <!-- Mensagem de erro -->
          <p v-if="error" class="text-red-500 text-xs md:text-sm mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const router = useRouter()
const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const loading = ref(false)
const error = ref(null)
const showErrors = ref(false)

// Carregar dados do usuário
onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  formData.value = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || ''
  }
})

const handleSubmit = async () => {
  showErrors.value = true

  // Validação apenas para nome e sobrenome
  if (!formData.value.firstName || !formData.value.lastName) {
    toast.error(t('profile.requiredFieldsError'))
    return
  }

  loading.value = true
  error.value = null

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const response = await api.patch(`/users/${user.id}`, {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      phone: formData.value.phone || null // Envia null se o telefone estiver vazio
    })

    // Atualizar dados do usuário no localStorage
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...response.data
    }))

    toast.success(t('profile.updateSuccess'))
  } catch (err) {
    console.error('Error updating profile:', err)
    toast.error(t('profile.updateError'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/my-account')
}
</script>

<style scoped>
input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

input:focus {
  outline: none;
  border-color: #FFDD00;
}
</style>


