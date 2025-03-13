<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow relative" :class="{'bg-empire-dark': !isHomePage}">
      <TheHeader class="absolute top-0 left-0 w-full" :class="{'bg-empire-dark': !isHomePage}" />
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
      return this.$route.name === 'home'
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
