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
            <span class="text-black">{{ $t('systemSettings.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl sm:text-[34px] leading-8 sm:leading-[40px]">
            {{ $t('systemSettings.title') }}
          </h1>
        </div>

        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Card - Configurações Financeiras (oculto temporariamente) -->
          <div v-if="false" class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.financial') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.financialDescription') }}</p>
            <router-link to="/settings/financial" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageFinancial') }}
            </router-link>
          </div>

          <!-- Card - Configurações de Conteúdo -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20.5H7.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-1.5"/>
                <path d="M17 9H7M17 13H7M7 17h5"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.content') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.contentDescription') }}</p>
            <router-link to="/settings/content" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageContent') }}
            </router-link>
          </div>

          <!-- Card - Configurações da Empresa -->
          <div class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
                <path d="M3 21h18"/>
                <path d="M9 7h6M9 11h6M9 15h6"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.company') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.companyDescription') }}</p>
            <router-link to="/settings/company" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageCompany') }}
            </router-link>
          </div>

          <!-- Card - Configurações de Categorias/Produtos (oculto conforme solicitado) -->
          <div v-if="false" class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.categoryProduct') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.categoryProductDescription') }}</p>
            <router-link to="/settings/category-product" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageCategoryProduct') }}
            </router-link>
          </div>

          <!-- Card - Relatório de Pedidos (oculto temporariamente) -->
          <div v-if="false" class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.orders') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.ordersDescription') }}</p>
            <router-link to="/settings/orders" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageOrders') }}
            </router-link>
          </div>

          <!-- Card - Configurações de Usuários (Visível apenas para ADMIN) -->
          <div v-if="isAdmin" class="bg-[#FAFAFA] p-4 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-xl sm:text-2xl">{{ $t('systemSettings.users') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-sm sm:text-base">{{ $t('systemSettings.usersDescription') }}</p>
            <router-link to="/settings/users" class="text-empire-yellow hover:underline mt-auto font-archivo text-sm sm:text-base">
              {{ $t('systemSettings.manageUsers') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

useI18n()

// Verifica se o usuário é um administrador
const isAdmin = ref(false)

onMounted(() => {
  // Recupera o perfil do usuário do localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.profile === 'ADMIN'
})
</script>