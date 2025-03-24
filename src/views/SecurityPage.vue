<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[768px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('security.title') }}</span>
          </nav>
        </div>

        <!-- Título -->
        <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px] mb-8">
          {{ $t('security.title') }}
        </h1>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="bg-[#FAFAFA] p-8">
          <div class="flex flex-col gap-6">
            <!-- Current Password -->
            <div class="flex flex-col gap-2">
              <input
                type="password"
                v-model="currentPassword"
                :placeholder="$t('security.currentPassword')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !currentPassword) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !currentPassword" class="text-red-500 text-sm">
                {{ $t('security.allFieldsRequired') }}
              </span>
            </div>

            <!-- New Password -->
            <div class="flex flex-col gap-2">
              <input
                type="password"
                v-model="newPassword"
                :placeholder="$t('security.newPassword')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !newPassword) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !newPassword" class="text-red-500 text-sm">
                {{ $t('security.allFieldsRequired') }}
              </span>
            </div>

            <!-- Confirm New Password -->
            <div class="flex flex-col gap-2">
              <input
                type="password"
                v-model="confirmPassword"
                :placeholder="$t('security.confirmNewPassword')"
                :class="[
                  'w-full p-4 border',
                  (showErrors && !confirmPassword) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <span v-if="showErrors && !confirmPassword" class="text-red-500 text-sm">
                {{ $t('security.allFieldsRequired') }}
              </span>
            </div>

            <!-- Botões -->
            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-empire-yellow py-4 flex justify-center items-center"
              >
                <span class="font-archivo-narrow font-semibold text-[20px] leading-[24px] text-black">
                  {{ isLoading ? $t('common.loading') : $t('security.updatePassword') }}
                </span>
              </button>
              <button
                type="button"
                @click="goBack"
                class="flex-1 bg-gray-200 text-black font-archivo font-semibold py-4 px-8 hover:bg-gray-300 transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const { t } = useI18n()
const router = useRouter()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const showErrors = ref(false)

const handleSubmit = async () => {
  showErrors.value = true

  // Validações
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    toast.error(t('security.allFieldsRequired'))
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error(t('security.passwordsDoNotMatch'))
    return
  }

  if (newPassword.value.length < 6) {
    toast.error(t('security.passwordTooShort'))
    return
  }

  try {
    isLoading.value = true
    
    await api.patch('/users/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })

    toast.success(t('security.passwordUpdated'))
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    router.push('/my-account')
  } catch (error) {
    if (error.response?.data?.message === 'Current password is incorrect') {
      toast.error(t('security.currentPasswordIncorrect'))
    } else {
      toast.error(t('security.updateError'))
    }
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/my-account')
}
</script>




