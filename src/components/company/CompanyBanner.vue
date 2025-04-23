<template>
  <div class="py-1.5 px-2 md:px-4 w-full relative" style="background: #FBBD1E;">
    <!-- Desktop version with horizontal scrollbar -->
    <div class="hidden md:block w-full">
      <div class="flex justify-center w-full">
        <div ref="scrollContainerDesktop" class="flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide" @scroll="checkScrollDesktop">
        <template v-if="loading">
          <div class="animate-pulse h-7 w-full bg-black/10 rounded"></div>
        </template>
        <template v-else-if="error">
          <div class="text-black text-sm">{{ error }}</div>
        </template>
        <template v-else>
          <div v-for="(company, index) in companies" :key="company.id" class="flex items-center">
            <span class="font-archivo font-medium text-[14px] leading-[28px] text-black text-center whitespace-nowrap" style="font-family: Archivo; font-weight: 500; letter-spacing: 0%;">
              {{ company.name }}
            </span>
            <!-- Add dot separator between companies except for the last one -->
            <div v-if="index < companies.length - 1" class="w-2.5 h-2.5 bg-black rounded-full mx-4"></div>
          </div>
        </template>
        </div>
      </div>
    </div>

    <!-- Mobile version with marquee effect -->
    <div class="md:hidden overflow-hidden">
      <template v-if="loading">
        <div class="animate-pulse h-7 w-full bg-black/10 rounded"></div>
      </template>
      <template v-else-if="error">
        <div class="text-black text-sm">{{ error }}</div>
      </template>
      <template v-else>
        <div class="marquee-container">
          <div class="marquee-content" :style="{ animationDuration: `${marqueeSpeed}s` }">
            <div v-for="company in companies" :key="`${company.id}-1`" class="flex items-center">
              <span class="font-archivo font-medium text-[13px] leading-[28px] text-black text-center whitespace-nowrap" style="font-family: Archivo; font-weight: 500; letter-spacing: 0%;">
                {{ company.name }}
              </span>
              <!-- Add dot separator between all companies in the marquee -->
              <div class="w-2.5 h-2.5 bg-black rounded-full mx-4"></div>
            </div>
          </div>
          <!-- Duplicate content for seamless looping -->
          <div class="marquee-content" :style="{ animationDuration: `${marqueeSpeed}s` }">
            <div v-for="company in companies" :key="`${company.id}-2`" class="flex items-center">
              <span class="font-archivo font-medium text-[13px] leading-[28px] text-black text-center whitespace-nowrap" style="font-family: Archivo; font-weight: 500; letter-spacing: 0%;">
                {{ company.name }}
              </span>
              <!-- Add dot separator between all companies in the marquee -->
              <div class="w-2.5 h-2.5 bg-black rounded-full mx-4"></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { companyService } from '@/services/companyService'

const companies = ref([])
const loading = ref(true)
const error = ref(null)
const scrollContainerDesktop = ref(null)

// Marquee speed calculation based on content length
const marqueeSpeed = computed(() => {
  // Base speed + additional time based on number of companies and average name length
  const baseSpeed = 15
  const avgNameLength = companies.value.reduce((sum, company) => sum + company.name.length, 0) / Math.max(1, companies.value.length)
  return baseSpeed + (companies.value.length * avgNameLength * 0.1)
})

// Function to fetch company data
const fetchCompanies = async () => {
  loading.value = true
  error.value = null

  try {
    // Get company information including contacts
    const companyInfo = await companyService.getCompanyInfo()

    if (companyInfo && companyInfo.company_name) {
      // Add the main company first
      companies.value = [{
        id: companyInfo.id,
        name: companyInfo.company_name
      }]

      // Then add the contacts
      if (companyInfo.contacts && companyInfo.contacts.length > 0) {
        // Add each contact's name to the companies array
        companyInfo.contacts.forEach(contact => {
          companies.value.push({
            id: contact.id,
            name: contact.name
          })
        })
      }
    }
  } catch (err) {
    console.error('Error fetching company data:', err)
    error.value = 'Failed to load company information'
  } finally {
    loading.value = false
  }
}

// Function to check scroll position for desktop
const checkScrollDesktop = () => {
  // No need for scroll indicators in desktop version
  // as we're using native scrollbar
}

// Initialize after data is loaded
const initializeScroll = async () => {
  await nextTick()
}

onMounted(async () => {
  await fetchCompanies()
  initializeScroll()
})
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Make sure the container doesn't add unnecessary padding */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Marquee container and animation */
.marquee-container {
  display: flex;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: flex;
  animation: marquee linear infinite;
  animation-play-state: running;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
