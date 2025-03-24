<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">{{ $t('career.title') }}</h1>

      <div class="space-y-8">
        <div class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ $t('career.whyJoin.title') }}</h2>
          <ul class="list-disc list-inside text-black space-y-2">
            <li>{{ $t('career.whyJoin.benefit1') }}</li>
            <li>{{ $t('career.whyJoin.benefit2') }}</li>
            <li>{{ $t('career.whyJoin.benefit3') }}</li>
            <li>{{ $t('career.whyJoin.benefit4') }}</li>
          </ul>
        </div>

        <div class="space-y-6">
          <h2 class="font-archivo-narrow text-2xl text-empire-yellow">{{ $t('career.openings.title') }}</h2>
          
          <div v-for="(position, index) in positions" :key="index" 
               class="bg-black/30 p-6 md:p-8 rounded-lg">
            <h3 class="font-archivo-narrow text-xl text-empire-yellow mb-2">{{ position.title }}</h3>
            <p class="text-empire-white-70 mb-4">{{ position.description }}</p>
            <button 
              @click="applyForPosition(position.title)"
              class="bg-empire-yellow text-black px-6 py-2 rounded-full hover:bg-empire-yellow/90 transition-colors"
            >
              {{ $t('career.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CareerView',
  data() {
    return {
      positions: [
        {
          title: this.$t('career.openings.position1.title'),
          description: this.$t('career.openings.position1.description')
        },
        {
          title: this.$t('career.openings.position2.title'),
          description: this.$t('career.openings.position2.description')
        },
        {
          title: this.$t('career.openings.position3.title'),
          description: this.$t('career.openings.position3.description')
        }
      ]
    }
  },
  methods: {
    applyForPosition(positionTitle) {
      this.$router.push({
        path: '/contact',
        query: {
          subject: 'job_application',
          position: positionTitle
        }
      })
    }
  }
}
</script>
