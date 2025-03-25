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
            <span class="text-black">{{ $t('systemSettings.content') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('systemSettings.content') }}
          </h1>
        </div>

        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card - História -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('content.history.title') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('content.history.description') }}</p>
            <router-link to="/settings/content/history" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('content.history.manage') }}
            </router-link>
          </div>

          <!-- Card - Fornecedores -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 3H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                <path d="M12 11v4M12 7h.01"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('content.suppliers.title') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('content.suppliers.description') }}</p>
            <router-link to="/settings/content/suppliers" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('content.suppliers.manage') }}
            </router-link>
          </div>

          <!-- Card - Carreira -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('content.career.title') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('content.career.description') }}</p>
            <router-link to="/settings/content/career" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('content.career.manage') }}
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


