<template>
  <div class="min-h-screen bg-white flex flex-col">
    <main class="flex-grow relative">
      <TheHeader class="absolute top-0 left-0 w-full" />
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
