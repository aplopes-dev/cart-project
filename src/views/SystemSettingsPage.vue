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
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('systemSettings.title') }}
          </h1>
        </div>

        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card - Configurações Financeiras -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('systemSettings.financial') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('systemSettings.financialDescription') }}</p>
            <router-link to="/settings/financial" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('systemSettings.manageFinancial') }}
            </router-link>
          </div>

          <!-- Card - Configurações de Conteúdo -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20.5H7.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-1.5"/>
                <path d="M17 9H7M17 13H7M7 17h5"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('systemSettings.content') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('systemSettings.contentDescription') }}</p>
            <router-link to="/settings/content" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('systemSettings.manageContent') }}
            </router-link>
          </div>

          <!-- Card - Configurações da Empresa -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
                <path d="M3 21h18"/>
                <path d="M9 7h6M9 11h6M9 15h6"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('systemSettings.company') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('systemSettings.companyDescription') }}</p>
            <router-link to="/settings/company" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('systemSettings.manageCompany') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

useI18n()
</script>