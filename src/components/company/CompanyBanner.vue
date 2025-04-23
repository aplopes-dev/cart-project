<template>
  <div class="py-1.5 px-6 w-full relative" style="background: #FBBD1E;">
    <!-- Gradient indicators for scroll on mobile -->
    <div class="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#FBBD1E] to-transparent md:hidden pointer-events-none scroll-indicator-left" :class="{ 'opacity-0': !canScrollLeft }"></div>
    <div class="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#FBBD1E] to-transparent md:hidden pointer-events-none scroll-indicator-right" :class="{ 'opacity-0': !canScrollRight }"></div>

    <div ref="scrollContainer" class="flex flex-row justify-center items-center gap-4 max-w-[555px] mx-auto overflow-x-auto scrollbar-hide md:overflow-x-visible" @scroll="checkScroll">
      <template v-if="loading">
        <div class="animate-pulse h-7 w-full bg-black/10 rounded"></div>
      </template>
      <template v-else-if="error">
        <div class="text-black text-sm">{{ error }}</div>
      </template>
      <template v-else>
        <div v-for="(company, index) in companies" :key="company.id" class="flex items-center">
          <span class="font-archivo font-medium text-[15px] leading-[28px] text-black text-center" style="font-family: Archivo; font-weight: 500; letter-spacing: 0%;">
            {{ company.name }}
          </span>
          <!-- Add dot separator between companies except for the last one -->
          <div v-if="index < companies.length - 1" class="w-2.5 h-2.5 bg-black rounded-full mx-4"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { companyService } from '@/services/companyService'

const companies = ref([])
const loading = ref(true)
const error = ref(null)
const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

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

// Function to check scroll position and update indicators
const checkScroll = () => {
  if (!scrollContainer.value) return

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1 // -1 for rounding errors
}

// Initialize after data is loaded
const initializeScroll = async () => {
  await nextTick()
  checkScroll()

  // Check if we need to show scroll indicators on initial load
  if (scrollContainer.value) {
    const { scrollWidth, clientWidth } = scrollContainer.value
    canScrollRight.value = scrollWidth > clientWidth
  }
}

onMounted(async () => {
  await fetchCompanies()
  initializeScroll()

  // Add resize listener to update scroll indicators
  window.addEventListener('resize', checkScroll)
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

/* Smooth transitions for scroll indicators */
.scroll-indicator-left,
.scroll-indicator-right {
  transition: opacity 0.3s ease;
}
</style>
