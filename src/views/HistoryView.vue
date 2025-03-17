<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">{{ $t('history.title') }}</h1>
      
      <div class="space-y-8">
        <div class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ $t('history.foundation.title') }}</h2>
          <p class="mb-4 text-black">{{ $t('history.foundation.text') }}</p>
        </div>

        <div class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ $t('history.growth.title') }}</h2>
          <p class="mb-4 text-black">{{ $t('history.growth.text') }}</p>
        </div>

        <div class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ $t('history.today.title') }}</h2>
          <p class="text-black">{{ $t('history.today.text') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView'
}
</script>