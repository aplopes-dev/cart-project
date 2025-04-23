<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow relative" :class="{'pt-0': isHomePage, 'pt-[60px]': !isHomePage}"> <!-- Reduzido de 120px para 60px -->
      <router-view/>
    </main>
    <TheFooter />
    <ToastNotification />
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import { useCartStore } from '@/stores/cartStore'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    ToastNotification
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  created() {
    this.$store.dispatch('initializeAuth')
    this.initializeCart()

    // Observa mudanças na rota para garantir que o carrinho seja recarregado
    const route = useRoute()
    watch(() => route.path, () => {
      console.log('Rota mudou, verificando carrinho')
      this.initializeCart()
    })
  },
  mounted() {
    // Adiciona listener para o evento de storage para atualizar o carrinho quando o localStorage mudar
    window.addEventListener('storage', this.handleStorageChange)

    // Adiciona listener para o evento beforeunload para garantir que o carrinho seja salvo antes de fechar a página
    window.addEventListener('beforeunload', this.saveCartBeforeUnload)

    // Adiciona listener para o evento pageshow para garantir que o carrinho seja recarregado quando a página for recarregada
    window.addEventListener('pageshow', this.handlePageShow)
  },
  unmounted() {
    // Remove os listeners quando o componente é desmontado
    window.removeEventListener('storage', this.handleStorageChange)
    window.removeEventListener('beforeunload', this.saveCartBeforeUnload)
    window.removeEventListener('pageshow', this.handlePageShow)
  },
  methods: {
    initializeCart() {
      const cartStore = useCartStore()
      const user = JSON.parse(localStorage.getItem('user'))

      if (user && user.id) {
        console.log('Inicializando carrinho para o usuário:', user.id)
        cartStore.loadCartFromStorage(user.id)
      } else {
        // Carregar carrinho de visitante
        const guestCart = localStorage.getItem('cart_guest')
        if (guestCart) {
          console.log('Inicializando carrinho para visitante')
          cartStore.items = JSON.parse(guestCart)
        }
      }
    },

    handleStorageChange(event) {
      // Verifica se a mudança foi no localStorage do carrinho
      const cartStore = useCartStore()
      const user = JSON.parse(localStorage.getItem('user'))

      if (user && user.id && event.key === `cart_${user.id}`) {
        console.log('Detectada mudança no localStorage do carrinho do usuário')
        if (event.newValue) {
          cartStore.items = JSON.parse(event.newValue)
        } else {
          cartStore.items = []
        }
      } else if (!user && event.key === 'cart_guest') {
        console.log('Detectada mudança no localStorage do carrinho de visitante')
        if (event.newValue) {
          cartStore.items = JSON.parse(event.newValue)
        } else {
          cartStore.items = []
        }
      }
    },

    saveCartBeforeUnload() {
      const cartStore = useCartStore()
      const user = JSON.parse(localStorage.getItem('user'))

      if (user && user.id) {
        console.log('Salvando carrinho no localStorage antes de fechar a página')
        cartStore.saveCartToStorage(user.id)
      } else {
        // Salvar carrinho de visitante
        localStorage.setItem('cart_guest', JSON.stringify(cartStore.items))
      }
    },

    handlePageShow(event) {
      // Verifica se a página foi recarregada (F5)
      if (event.persisted) {
        console.log('Página recarregada, reinicializando o carrinho')
        this.initializeCart()
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>


