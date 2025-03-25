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
            <span class="text-black">{{ $t('content.career.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('content.career.title') }}
          </h1>
        </div>

        <!-- Form Content -->
        <div class="space-y-8">
          <!-- Why Join Section -->
          <div class="bg-[#FAFAFA] p-6 rounded-lg">
            <h2 class="font-archivo-narrow text-2xl mb-6">{{ $t('career.whyJoin.title') }}</h2>
            <div class="space-y-4">
              <div v-for="(benefit, index) in benefits" :key="index" class="flex gap-4">
                <input
                  type="text"
                  v-model="benefit.text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                  :placeholder="$t('content.history.form.textPlaceholder')"
                />
                <button
                  @click="removeBenefit(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                @click="addBenefit"
                class="text-empire-yellow hover:text-empire-yellow/80 font-archivo"
              >
                + {{ $t('content.history.form.add') }}
              </button>
            </div>
          </div>

          <!-- Job Positions Section -->
          <div class="bg-[#FAFAFA] p-6 rounded-lg">
            <h2 class="font-archivo-narrow text-2xl mb-6">{{ $t('career.openings.title') }}</h2>
            <div class="space-y-6">
              <div v-for="(position, index) in positions" :key="index" class="space-y-4 p-4 border border-gray-200 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="flex-1 space-y-4">
                    <input
                      type="text"
                      v-model="position.title"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                      :placeholder="$t('content.history.form.titlePlaceholder')"
                    />
                    <textarea
                      v-model="position.description"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                      :placeholder="$t('content.history.form.textPlaceholder')"
                    ></textarea>
                  </div>
                  <button
                    @click="removePosition(index)"
                    class="text-red-500 hover:text-red-700 ml-4"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addPosition"
                class="text-empire-yellow hover:text-empire-yellow/80 font-archivo"
              >
                + {{ $t('content.history.form.add') }}
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end">
            <button
              @click="saveChanges"
              class="bg-empire-yellow text-black px-8 py-3 rounded-lg font-archivo hover:bg-empire-yellow/80"
              :disabled="saving"
            >
              {{ saving ? $t('profile.saving') : $t('profile.save') }}
            </button>
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

const benefits = ref([
  { text: t('career.whyJoin.benefit1') },
  { text: t('career.whyJoin.benefit2') },
  { text: t('career.whyJoin.benefit3') },
  { text: t('career.whyJoin.benefit4') }
])

const positions = ref([
  {
    title: t('career.openings.position1.title'),
    description: t('career.openings.position1.description')
  },
  {
    title: t('career.openings.position2.title'),
    description: t('career.openings.position2.description')
  },
  {
    title: t('career.openings.position3.title'),
    description: t('career.openings.position3.description')
  }
])

const saving = ref(false)

const addBenefit = () => {
  benefits.value.push({ text: '' })
}

const removeBenefit = (index) => {
  benefits.value.splice(index, 1)
}

const addPosition = () => {
  positions.value.push({ title: '', description: '' })
}

const removePosition = (index) => {
  positions.value.splice(index, 1)
}

const saveChanges = async () => {
  saving.value = true
  try {
    // Implement save logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    // Show success message or handle response
  } catch (error) {
    // Handle error
  } finally {
    saving.value = false
  }
}
</script>
