<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título -->
        <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px] mb-8">
          {{ $t('myAccount.title') }}
        </h1>

        <!-- Grid de Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card - Pedidos -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 17h6M9 13h6M3 8h18v13H3V8zM3 8l2-4h14l2 4"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.orders') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.ordersDescription') }}</p>
            <router-link to="/orders" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('myAccount.viewOrders') }}
            </router-link>
          </div>

          <!-- Card - Dados Pessoais -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.personalInfo') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.personalInfoDescription') }}</p>
            <router-link to="/profile" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('myAccount.editProfile') }}
            </router-link>
          </div>

          <!-- Card - Endereços -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20s-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-7 10-7 10z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.addresses') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.addressesDescription') }}</p>
            <router-link to="/addresses" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('myAccount.manageAddresses') }}
            </router-link>
          </div>

          <!-- Card - Favoritos -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.favorites') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.favoritesDescription') }}</p>
            <router-link to="/favorites" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('myAccount.viewFavorites') }}
            </router-link>
          </div>

          <!-- Card - Segurança -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.security') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.securityDescription') }}</p>
            <router-link to="/security" class="text-empire-yellow hover:underline mt-auto font-archivo">
              {{ $t('myAccount.managePassword') }}
            </router-link>
          </div>

          <!-- Card - Sair -->
          <div class="bg-[#FAFAFA] p-8 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>
              <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('myAccount.logout') }}</h2>
            </div>
            <p class="text-black/70 font-archivo text-base">{{ $t('myAccount.logoutDescription') }}</p>
            <button @click="handleLogout" class="text-empire-yellow hover:underline mt-auto font-archivo text-left">
              {{ $t('myAccount.signOut') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useCartStore } from '@/stores/cartStore' // Corrigido o caminho do import

const router = useRouter()
const store = useStore()
const cartStore = useCartStore()
useI18n()

const handleLogout = async () => {
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  
  if (userId) {
    try {
      // Recupera os dados do carrinho do localStorage antes de apagar
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        if (cartItems.length > 0) {
          // Sincroniza com o backend antes de limpar
          await cartStore.syncCartWithBackend();
          console.log('Cart synced before logout');
        }
      }
    } catch (error) {
      console.error('Error syncing cart before logout:', error);
    }
  }
  
  await store.dispatch('logout');
  
  // Remove os dados do carrinho do localStorage
  localStorage.removeItem(`cart_${userId}`);
  localStorage.removeItem('user');
  
  // Reset do estado do carrinho
  cartStore.$reset();
  
  router.replace('/');
}
</script>



