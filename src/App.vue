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


