<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-[600px] mx-auto">
        <!-- Ícone de acesso negado -->
        <div class="mb-8 text-red-600">
          <svg class="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        
        <!-- Título -->
        <h1 class="font-archivo-narrow font-semibold text-3xl md:text-4xl mb-4 text-gray-900">
          {{ $t('accessDenied.title') }}
        </h1>
        
        <!-- Mensagem -->
        <p class="font-archivo text-lg text-gray-700 mb-8">
          {{ $t('accessDenied.message') }}
        </p>
        
        <!-- Botões -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/" class="bg-empire-yellow text-black py-3 px-6 rounded font-archivo font-medium">
            {{ $t('accessDenied.goHome') }}
          </router-link>
          <router-link to="/my-account" class="bg-gray-200 text-gray-800 py-3 px-6 rounded font-archivo font-medium">
            {{ $t('accessDenied.goToAccount') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

useI18n()
</script>
