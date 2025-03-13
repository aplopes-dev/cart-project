<template>
  <section class="flex flex-col items-center py-24 px-6 gap-6 w-full bg-[#FAFAFA]">
    <!-- Container com scroll horizontal no mobile -->
    <div class="w-full max-w-[1146px] overflow-x-auto scrollbar-hide">
      <div class="flex justify-start md:justify-center items-start gap-9 min-w-max md:min-w-0">
        <img 
          v-for="i in 5" 
          :key="i"
          :src="`/img/brand-logo-${i}.png`" 
          :alt="`Brand Logo ${i}`"
          class="w-[167px] h-24 object-contain flex-shrink-0"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BrandLogos'
}
</script>
<style scoped>
/* Esconde a scrollbar mas mantém a funcionalidade */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
