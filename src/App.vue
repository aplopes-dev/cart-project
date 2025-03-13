<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow relative" :class="{'pt-0': isHomePage, 'pt-[120px]': !isHomePage}"> <!-- Reduzido de 180px para 120px -->
      <router-view/>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
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
