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
            <span class="text-black">{{ $t('systemSettings.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl sm:text-[34px] leading-8 sm:leading-[40px]">
            {{ $t('systemSettings.title') }}
          </h1>
        </div>

        <!-- Settings Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Card - Financial -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.financial') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.financialDescription') }}</p>
            <router-link to="/settings/financial" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageFinancial') }}
            </router-link>
          </div>

          <!-- Card - Content -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M15 14l2 2 4-4" />
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.content') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.contentDescription') }}</p>
            <router-link to="/settings/content" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageContent') }}
            </router-link>
          </div>

          <!-- Card - Company -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path d="M9 22V12h6v10" />
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.company') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.companyDescription') }}</p>
            <router-link to="/settings/company" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageCompany') }}
            </router-link>
          </div>

          <!-- Card - Category/Product -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.categoryProduct') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.categoryProductDescription') }}</p>
            <router-link to="/settings/category-product" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageCategoryProduct') }}
            </router-link>
          </div>

          <!-- Card - Users (Only visible to Admin) -->
          <div v-if="isAdmin" class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.users') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.usersDescription') }}</p>
            <router-link to="/settings/users" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageUsers') }}
            </router-link>
          </div>

          <!-- Card - Home -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('settings.home.title') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('settings.home.description') }}</p>
            <router-link to="/settings/home" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('settings.home.manage') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAdmin = computed(() => store.getters['auth/isAdmin'])
</script>
