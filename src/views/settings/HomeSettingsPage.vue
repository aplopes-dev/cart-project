<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('systemSettings.home') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('systemSettings.home') }}
          </h1>
        </div>

        <!-- Tabs -->
        <div class="mb-8">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm font-archivo',
                  activeTab === tab.id
                    ? 'border-empire-yellow text-empire-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading[activeTab]" class="flex justify-center items-center py-12">
          <div class="w-12 h-12 border-4 border-empire-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error Message -->
        <div v-else-if="error[activeTab]" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{{ error[activeTab] }}</p>
        </div>

        <!-- Banner Tab Content -->
        <div v-else-if="activeTab === 'banner'" class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('homeBanner.title') }}</h2>
            <button
              @click="openBannerModal()"
              class="bg-empire-yellow text-black px-4 py-2 rounded font-archivo font-medium"
            >
              {{ $t('homeBanner.addNew') }}
            </button>
          </div>

          <!-- Banner Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.image') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.title') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.subtitle') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.status') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.position') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('homeBanner.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50">
                  <td class="py-3 px-4 border-b">
                    <img :src="banner.image_url" alt="Banner" class="w-20 h-12 object-cover rounded">
                  </td>
                  <td class="py-3 px-4 border-b">
                    <div class="flex items-center">
                      <span>{{ banner.title }}</span>
                      <div
                        class="w-4 h-4 ml-2 rounded-full"
                        :style="{ backgroundColor: banner.title_color }"
                        :title="banner.title_color"
                      ></div>
                    </div>
                  </td>
                  <td class="py-3 px-4 border-b">
                    <div class="flex items-center">
                      <span>{{ truncateText(banner.subtitle, 30) }}</span>
                      <div
                        class="w-4 h-4 ml-2 rounded-full"
                        :style="{ backgroundColor: banner.subtitle_color }"
                        :title="banner.subtitle_color"
                      ></div>
                    </div>
                  </td>
                  <td class="py-3 px-4 border-b">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ banner.is_active ? $t('homeBanner.active') : $t('homeBanner.inactive') }}
                    </span>
                  </td>
                  <td class="py-3 px-4 border-b">
                    {{ banner.position }}
                  </td>
                  <td class="py-3 px-4 border-b">
                    <div class="flex space-x-4">
                      <button
                        @click="openBannerModal(banner)"
                        class="text-blue-600 hover:text-blue-800"
                        :title="$t('homeBanner.edit')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(banner)"
                        class="text-red-600 hover:text-red-800"
                        :title="$t('homeBanner.delete')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="banners.length === 0">
                  <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                    {{ $t('homeBanner.noBanners') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Banner Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-archivo-narrow font-semibold mb-4">
              {{ editingBanner ? $t('homeBanner.editBanner') : $t('homeBanner.addBanner') }}
            </h2>

            <form @submit.prevent="saveBanner">
              <!-- Title -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="title">
                  {{ $t('homeBanner.title') }} *
                </label>
                <input
                  id="title"
                  v-model="bannerForm.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  required
                >
              </div>

              <!-- Subtitle -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="subtitle">
                  {{ $t('homeBanner.subtitle') }} *
                </label>
                <textarea
                  id="subtitle"
                  v-model="bannerForm.subtitle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="image">
                  {{ $t('homeBanner.image') }} *
                </label>
                <div class="flex items-start space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input
                        type="file"
                        id="image"
                        ref="imageInput"
                        @change="handleImageChange"
                        accept="image/*"
                        class="hidden"
                      >
                      <button
                        type="button"
                        @click="$refs.imageInput.click()"
                        class="px-4 py-2 border-2 border-black/25 rounded font-archivo text-base hover:border-empire-yellow focus:outline-none focus:border-empire-yellow"
                      >
                        {{ $t('homeBanner.chooseFile') }}
                      </button>
                      <span class="ml-2 text-sm text-gray-600">
                        {{ selectedFileName || $t('homeBanner.noFileChosen') }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ $t('homeBanner.imageRequirements') }}
                    </p>
                  </div>
                  <div v-if="bannerForm.image_url || imagePreview" class="w-24 h-16">
                    <img
                      :src="imagePreview || bannerForm.image_url"
                      alt="Preview"
                      class="w-full h-full object-cover rounded"
                    >
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Title Color -->
                <div>
                  <label class="block font-archivo text-sm font-medium mb-2" for="titleColor">
                    {{ $t('homeBanner.titleColor') }}
                  </label>
                  <div class="flex items-center">
                    <input
                      id="titleColor"
                      v-model="bannerForm.title_color"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                      placeholder="#FFFFFF"
                    >
                    <input
                      type="color"
                      v-model="bannerForm.title_color"
                      class="ml-2 w-10 h-10 rounded cursor-pointer"
                    >
                  </div>
                </div>

                <!-- Subtitle Color -->
                <div>
                  <label class="block font-archivo text-sm font-medium mb-2" for="subtitleColor">
                    {{ $t('homeBanner.subtitleColor') }}
                  </label>
                  <div class="flex items-center">
                    <input
                      id="subtitleColor"
                      v-model="bannerForm.subtitle_color"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                      placeholder="#FFFFFF"
                    >
                    <input
                      type="color"
                      v-model="bannerForm.subtitle_color"
                      class="ml-2 w-10 h-10 rounded cursor-pointer"
                    >
                  </div>
                </div>
              </div>

              <!-- Position and Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Position -->
                <div>
                  <label class="block font-archivo text-sm font-medium mb-2" for="position">
                    {{ $t('homeBanner.position') }}
                  </label>
                  <input
                    id="position"
                    v-model.number="bannerForm.position"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  >
                </div>

                <!-- Status -->
                <div class="flex items-center h-full pt-8">
                  <input
                    id="isActive"
                    v-model="bannerForm.is_active"
                    type="checkbox"
                    class="w-4 h-4 text-empire-yellow focus:ring-empire-yellow rounded"
                  >
                  <label class="ml-2 font-archivo text-sm font-medium" for="isActive">
                    {{ $t('homeBanner.isActive') }}
                  </label>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-empire-yellow text-black rounded-md font-archivo hover:bg-yellow-500"
                  :disabled="saving"
                >
                  <span v-if="saving">{{ $t(editingBanner ? 'common.updating' : 'common.saving') }}...</span>
                  <span v-else>{{ $t(editingBanner ? 'common.update' : 'common.save') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-archivo-narrow font-semibold mb-4">
              {{ $t('homeBanner.confirmDelete') }}
            </h2>
            <p class="mb-6 font-archivo text-gray-700">
              {{ $t('homeBanner.deleteWarning') }}
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="deleteBanner"
                class="px-4 py-2 bg-red-600 text-white rounded-md font-archivo hover:bg-red-700"
                :disabled="deleting"
              >
                <span v-if="deleting">{{ $t('common.deleting') }}...</span>
                <span v-else>{{ $t('common.delete') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Logo Tab Content -->
        <div v-else-if="activeTab === 'logo'" class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('logo.title') }}</h2>
            <button
              @click="openLogoModal()"
              class="bg-empire-yellow text-black px-4 py-2 rounded font-archivo font-medium"
            >
              {{ $t('logo.addNew') }}
            </button>
          </div>

          <!-- Logo Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('logo.image') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('logo.name') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('logo.description') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('logo.status') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('logo.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="logo in logos" :key="logo.id" class="hover:bg-gray-50">
                  <td class="py-3 px-4 border-b">
                    <img :src="logo.image_url" alt="Logo" class="w-20 h-12 object-contain">
                  </td>
                  <td class="py-3 px-4 border-b">{{ logo.name }}</td>
                  <td class="py-3 px-4 border-b">{{ truncateText(logo.description, 30) }}</td>
                  <td class="py-3 px-4 border-b">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        logo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ logo.is_active ? $t('logo.active') : $t('logo.inactive') }}
                    </span>
                  </td>
                  <td class="py-3 px-4 border-b">
                    <div class="flex space-x-4">
                      <button
                        @click="openLogoModal(logo)"
                        class="text-blue-600 hover:text-blue-800"
                        :title="$t('logo.edit')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="!logo.is_active"
                        @click="confirmDeleteLogo(logo)"
                        class="text-red-600 hover:text-red-800"
                        :title="$t('logo.delete')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="logos.length === 0">
                  <td colspan="5" class="py-4 px-4 text-center text-gray-500">
                    {{ $t('logo.noLogos') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Brands Tab Content -->
        <div v-else-if="activeTab === 'brands'" class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('brand.title') }}</h2>
            <button
              @click="openBrandModal()"
              class="bg-empire-yellow text-black px-4 py-2 rounded font-archivo font-medium"
            >
              {{ $t('brand.addNew') }}
            </button>
          </div>

          <!-- Brands Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.image') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.name') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.description') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.status') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.position') }}</th>
                  <th class="py-3 px-4 border-b text-left font-archivo font-semibold">{{ $t('brand.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="brand in brands" :key="brand.id" class="hover:bg-gray-50">
                  <td class="py-3 px-4 border-b">
                    <img :src="brand.logo" alt="Brand" class="w-20 h-12 object-contain">
                  </td>
                  <td class="py-3 px-4 border-b">{{ brand.name }}</td>
                  <td class="py-3 px-4 border-b">{{ truncateText(brand.description, 30) }}</td>
                  <td class="py-3 px-4 border-b">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ brand.isActive ? $t('brand.active') : $t('brand.inactive') }}
                    </span>
                  </td>
                  <td class="py-3 px-4 border-b">{{ brand.position }}</td>
                  <td class="py-3 px-4 border-b">
                    <div class="flex space-x-4">
                      <button
                        @click="openBrandModal(brand)"
                        class="text-blue-600 hover:text-blue-800"
                        :title="$t('brand.edit')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="confirmDeleteBrand(brand)"
                        class="text-red-600 hover:text-red-800"
                        :title="$t('brand.delete')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="brands.length === 0">
                  <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                    {{ $t('brand.noBrands') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Logo Modal -->
        <div v-if="showLogoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-archivo-narrow font-semibold mb-4">
              {{ editingLogo ? $t('logo.editLogo') : $t('logo.addLogo') }}
            </h2>

            <form @submit.prevent="saveLogo">
              <!-- Name -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="logoName">
                  {{ $t('logo.name') }} *
                </label>
                <input
                  id="logoName"
                  v-model="logoForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  required
                >
              </div>

              <!-- Description -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="logoDescription">
                  {{ $t('logo.description') }}
                </label>
                <textarea
                  id="logoDescription"
                  v-model="logoForm.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  rows="3"
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="logoImage">
                  {{ $t('logo.image') }} *
                </label>
                <div class="flex items-start space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input
                        type="file"
                        id="logoImage"
                        ref="logoImageInput"
                        @change="handleLogoImageChange"
                        accept="image/png,image/svg+xml"
                        class="hidden"
                      >
                      <button
                        type="button"
                        @click="$refs.logoImageInput.click()"
                        class="px-4 py-2 border-2 border-black/25 rounded font-archivo text-base hover:border-empire-yellow focus:outline-none focus:border-empire-yellow"
                      >
                        {{ $t('logo.chooseFile') }}
                      </button>
                      <span class="ml-2 text-sm text-gray-600">
                        {{ logoSelectedFileName || $t('logo.noFileChosen') }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ $t('logo.imageRequirements') }}
                    </p>
                  </div>
                  <div v-if="logoForm.image_url || logoImagePreview" class="w-24 h-24">
                    <img
                      :src="logoImagePreview || logoForm.image_url"
                      alt="Preview"
                      class="w-full h-full object-contain"
                    >
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div class="mb-6">
                <div class="flex items-center">
                  <input
                    id="logoIsActive"
                    v-model="logoForm.is_active"
                    type="checkbox"
                    class="w-4 h-4 text-empire-yellow focus:ring-empire-yellow rounded"
                    :disabled="isOnlyActiveLogo"
                    :title="isOnlyActiveLogo ? $t('logo.cannotDeactivateOnly') : ''"
                  >
                  <label class="ml-2 font-archivo text-sm font-medium" for="logoIsActive">
                    {{ $t('logo.isActive') }}
                  </label>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  {{ $t('logo.activeInfo') }}
                </p>
                <p v-if="isOnlyActiveLogo" class="mt-1 text-xs text-red-500">
                  {{ $t('logo.cannotDeactivateOnly') }}
                </p>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeLogoModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-empire-yellow text-black rounded-md font-archivo hover:bg-yellow-500"
                  :disabled="logoSaving"
                >
                  <span v-if="logoSaving">{{ $t(editingLogo ? 'common.updating' : 'common.saving') }}...</span>
                  <span v-else>{{ $t(editingLogo ? 'common.update' : 'common.save') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Logo Delete Confirmation Modal -->
        <div v-if="showLogoDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-archivo-narrow font-semibold mb-4">
              {{ $t('logo.confirmDelete') }}
            </h2>
            <p class="mb-6 font-archivo text-gray-700">
              {{ $t('logo.deleteWarning') }}
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showLogoDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="deleteLogo"
                class="px-4 py-2 bg-red-600 text-white rounded-md font-archivo hover:bg-red-700"
                :disabled="logoDeleting"
              >
                <span v-if="logoDeleting">{{ $t('common.deleting') }}...</span>
                <span v-else>{{ $t('common.delete') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Brand Modal -->
        <div v-if="showBrandModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-archivo-narrow font-semibold mb-4">
              {{ editingBrand ? $t('brand.editBrand') : $t('brand.addBrand') }}
            </h2>

            <form @submit.prevent="saveBrand">
              <!-- Name -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="brandName">
                  {{ $t('brand.name') }} *
                </label>
                <input
                  id="brandName"
                  v-model="brandForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  required
                >
              </div>

              <!-- Description -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="brandDescription">
                  {{ $t('brand.description') }}
                </label>
                <textarea
                  id="brandDescription"
                  v-model="brandForm.description"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  rows="3"
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div class="mb-4">
                <label class="block font-archivo text-sm font-medium mb-2" for="brandImage">
                  {{ $t('brand.image') }} *
                </label>
                <div class="flex items-start space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <input
                        type="file"
                        id="brandImage"
                        ref="brandImageInput"
                        @change="handleBrandImageChange"
                        accept="image/png,image/svg+xml"
                        class="hidden"
                      >
                      <button
                        type="button"
                        @click="$refs.brandImageInput.click()"
                        class="px-4 py-2 border-2 border-black/25 rounded font-archivo text-base hover:border-empire-yellow focus:outline-none focus:border-empire-yellow"
                      >
                        {{ $t('brand.chooseFile') }}
                      </button>
                      <span class="ml-2 text-sm text-gray-600">
                        {{ brandSelectedFileName || $t('brand.noFileChosen') }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ $t('brand.imageRequirements') }}
                    </p>
                  </div>
                  <div v-if="brandForm.logo || brandImagePreview" class="w-24 h-24">
                    <img
                      :src="brandImagePreview || brandForm.logo"
                      alt="Preview"
                      class="w-full h-full object-contain"
                    >
                  </div>
                </div>
              </div>

              <!-- Position and Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- Position -->
                <div>
                  <label class="block font-archivo text-sm font-medium mb-2" for="brandPosition">
                    {{ $t('brand.position') }}
                  </label>
                  <input
                    id="brandPosition"
                    v-model.number="brandForm.position"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-empire-yellow"
                  >
                </div>

                <!-- Status -->
                <div class="flex items-center h-full pt-8">
                  <input
                    id="brandIsActive"
                    v-model="brandForm.isActive"
                    type="checkbox"
                    class="w-4 h-4 text-empire-yellow focus:ring-empire-yellow rounded"
                  >
                  <label class="ml-2 font-archivo text-sm font-medium" for="brandIsActive">
                    {{ $t('brand.isActive') }}
                  </label>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeBrandModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-empire-yellow text-black rounded-md font-archivo hover:bg-yellow-500"
                  :disabled="brandSaving"
                >
                  <span v-if="brandSaving">{{ $t(editingBrand ? 'common.updating' : 'common.saving') }}...</span>
                  <span v-else>{{ $t(editingBrand ? 'common.update' : 'common.save') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Brand Delete Confirmation Modal -->
        <div v-if="showBrandDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-archivo-narrow font-semibold mb-4">
              {{ $t('brand.confirmDelete') }}
            </h2>
            <p class="mb-6 font-archivo text-gray-700">
              {{ $t('brand.deleteWarning') }}
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showBrandDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-archivo hover:bg-gray-50"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="deleteBrand"
                class="px-4 py-2 bg-red-600 text-white rounded-md font-archivo hover:bg-red-700"
                :disabled="brandDeleting"
              >
                <span v-if="brandDeleting">{{ $t('common.deleting') }}...</span>
                <span v-else>{{ $t('common.delete') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

// Tabs
const tabs = [
  { id: 'banner', name: t('homeTabs.banner') },
  { id: 'logo', name: t('homeTabs.logo') },
  { id: 'brands', name: t('homeTabs.brands') }
]
const activeTab = ref('banner')

// State for all tabs
const loading = ref({
  banner: true,
  logo: true,
  brands: true
})
const error = ref({
  banner: null,
  logo: null,
  brands: null
})

// Banner state
const banners = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingBanner = ref(null)
const bannerToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)
const imagePreview = ref(null)
const selectedFileName = ref('')

// Logo state
const logos = ref([])
const showLogoModal = ref(false)
const showLogoDeleteModal = ref(false)
const editingLogo = ref(null)
const logoToDelete = ref(null)
const logoSaving = ref(false)
const logoDeleting = ref(false)
const logoImagePreview = ref(null)
const logoSelectedFileName = ref('')

// Brand state
const brands = ref([])
const showBrandModal = ref(false)
const showBrandDeleteModal = ref(false)
const editingBrand = ref(null)
const brandToDelete = ref(null)
const brandSaving = ref(false)
const brandDeleting = ref(false)
const brandImagePreview = ref(null)
const brandSelectedFileName = ref('')

// Form
const bannerForm = reactive({
  title: '',
  subtitle: '',
  image_url: '',
  title_color: '#FFFFFF',
  subtitle_color: '#FFFFFF',
  position: 0,
  is_active: true
})

// API URL
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

// Fetch banners
const fetchBanners = async () => {
  loading.value.banner = true
  error.value.banner = null

  try {
    const response = await axios.get(`${API_URL}/settings/home-banners`)
    banners.value = response.data
  } catch (err) {
    console.error('Error fetching banners:', err)
    error.value.banner = t('homeBanner.fetchError')
    toast.error(error.value.banner)
  } finally {
    loading.value.banner = false
  }
}

// Open banner modal
const openBannerModal = (banner = null) => {
  editingBanner.value = banner

  if (banner) {
    // Edit existing banner
    Object.keys(bannerForm).forEach(key => {
      bannerForm[key] = banner[key]
    })
  } else {
    // Add new banner
    Object.keys(bannerForm).forEach(key => {
      if (key === 'title_color' || key === 'subtitle_color') {
        bannerForm[key] = '#FFFFFF'
      } else if (key === 'is_active') {
        bannerForm[key] = true
      } else if (key === 'position') {
        // Set position to the next available position
        const positions = banners.value.map(b => b.position)
        bannerForm[key] = positions.length > 0 ? Math.max(...positions) + 1 : 0
      } else {
        bannerForm[key] = ''
      }
    })
  }

  imagePreview.value = null
  selectedFileName.value = ''
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingBanner.value = null
}

// Handle image change
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('homeBanner.invalidImageType'))
      event.target.value = ''
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('homeBanner.imageTooLarge'))
      event.target.value = ''
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    selectedFileName.value = file.name
  } else {
    imagePreview.value = null
    selectedFileName.value = ''
  }
}

// Save banner
const saveBanner = async () => {
  saving.value = true

  try {
    // Upload image if a new one was selected
    if (imagePreview.value && selectedFileName.value) {
      const formData = new FormData()
      formData.append('file', document.getElementById('image').files[0])

      const uploadResponse = await axios.post(
        `${API_URL}/settings/home-banners/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      bannerForm.image_url = uploadResponse.data.url
    }

    if (editingBanner.value) {
      // Update existing banner
      await axios.put(
        `${API_URL}/settings/home-banners/${editingBanner.value.id}`,
        bannerForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    } else {
      // Create new banner
      await axios.post(
        `${API_URL}/settings/home-banners`,
        bannerForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    }

    // Refresh banners
    await fetchBanners()

    // Close modal
    closeModal()

    // Show success message
    toast.success(t(editingBanner.value ? 'homeBanner.updateSuccess' : 'homeBanner.createSuccess'))
  } catch (err) {
    console.error('Error saving banner:', err)
    toast.error(t('homeBanner.saveError'))
  } finally {
    saving.value = false
  }
}

// Confirm delete
const confirmDelete = (banner) => {
  bannerToDelete.value = banner
  showDeleteModal.value = true
}

// Delete banner
const deleteBanner = async () => {
  if (!bannerToDelete.value) return

  deleting.value = true

  try {
    await axios.delete(
      `${API_URL}/settings/home-banners/${bannerToDelete.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    // Refresh banners
    await fetchBanners()

    // Close modal
    showDeleteModal.value = false
    bannerToDelete.value = null

    // Show success message
    toast.success(t('homeBanner.deleteSuccess'))
  } catch (err) {
    console.error('Error deleting banner:', err)
    toast.error(t('homeBanner.deleteError'))
  } finally {
    deleting.value = false
  }
}

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Verifica se é a única logo ativa
const isOnlyActiveLogo = computed(() => {
  if (!editingLogo.value || !editingLogo.value.is_active) return false
  const activeLogosCount = logos.value.filter(logo => logo.is_active).length
  return activeLogosCount <= 1
})

// Logo Form
const logoForm = reactive({
  name: '',
  description: '',
  image_url: '',
  is_active: false
})

// Brand Form
const brandForm = reactive({
  name: '',
  description: '',
  logo: '',
  position: 0,
  isActive: true
})

// Fetch logos
const fetchLogos = async () => {
  loading.value.logo = true
  error.value.logo = null

  try {
    const response = await axios.get(`${API_URL}/settings/logos`)
    logos.value = response.data
  } catch (err) {
    console.error('Error fetching logos:', err)
    error.value.logo = t('logo.fetchError')
    toast.error(error.value.logo)
  } finally {
    loading.value.logo = false
  }
}

// Open logo modal
const openLogoModal = (logo = null) => {
  editingLogo.value = logo

  if (logo) {
    // Edit existing logo
    Object.keys(logoForm).forEach(key => {
      logoForm[key] = logo[key]
    })
  } else {
    // Add new logo
    logoForm.name = ''
    logoForm.description = ''
    logoForm.image_url = ''
    logoForm.is_active = false

    // Verifica se já existe uma logo ativa
    const hasActiveLogo = logos.value.some(l => l.is_active)
    if (!hasActiveLogo) {
      // Se não houver nenhuma logo ativa, define esta como ativa por padrão
      logoForm.is_active = true
      toast.info(t('logo.firstLogoActive'))
    }
  }

  logoImagePreview.value = null
  logoSelectedFileName.value = ''
  showLogoModal.value = true
}

// Close logo modal
const closeLogoModal = () => {
  showLogoModal.value = false
  editingLogo.value = null
}

// Handle logo image change
const handleLogoImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    const allowedTypes = ['image/png', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('logo.invalidImageType'))
      event.target.value = ''
      return
    }

    // Validate file size (max 1MB)
    const maxSize = 1 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('logo.imageTooLarge'))
      event.target.value = ''
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      logoImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    logoSelectedFileName.value = file.name
  } else {
    logoImagePreview.value = null
    logoSelectedFileName.value = ''
  }
}

// Save logo
const saveLogo = async () => {
  logoSaving.value = true

  try {
    // Verificar se está tentando desativar a única logo ativa
    if (editingLogo.value && editingLogo.value.is_active && !logoForm.is_active) {
      // Contar quantas logos ativas existem
      const activeLogosCount = logos.value.filter(logo => logo.is_active).length
      if (activeLogosCount <= 1) {
        toast.error(t('logo.cannotDeactivateOnly'))
        logoSaving.value = false
        return
      }
    }

    // Upload image if a new one was selected
    if (logoImagePreview.value && logoSelectedFileName.value) {
      const formData = new FormData()
      formData.append('file', document.getElementById('logoImage').files[0])

      const uploadResponse = await axios.post(
        `${API_URL}/settings/logos/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      logoForm.image_url = uploadResponse.data.url
    }

    // Se esta logo está sendo definida como ativa, desative todas as outras logos no frontend
    if (logoForm.is_active) {
      logos.value.forEach(logo => {
        if (editingLogo.value && logo.id === editingLogo.value.id) {
          return // Não altere a logo que está sendo editada
        }
        logo.is_active = false
      })
    }

    if (editingLogo.value) {
      // Update existing logo
      await axios.put(
        `${API_URL}/settings/logos/${editingLogo.value.id}`,
        logoForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    } else {
      // Create new logo
      await axios.post(
        `${API_URL}/settings/logos`,
        logoForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    }

    // Refresh logos
    await fetchLogos()

    // Close modal
    closeLogoModal()

    // Show success message
    toast.success(t(editingLogo.value ? 'logo.updateSuccess' : 'logo.createSuccess'))
  } catch (err) {
    console.error('Error saving logo:', err)

    // Verificar se é o erro específico de tentar desativar a única logo ativa
    if (err.response && err.response.status === 409 &&
        err.response.data && err.response.data.message &&
        err.response.data.message.includes('Cannot deactivate the only active logo')) {
      toast.error(t('logo.cannotDeactivateOnly'))
    } else {
      toast.error(t('logo.saveError'))
    }
  } finally {
    logoSaving.value = false
  }
}

// Confirm delete logo
const confirmDeleteLogo = (logo) => {
  // Verificar se é a única logo no sistema
  if (logos.value.length <= 1) {
    toast.error(t('logo.cannotDeleteOnly'))
    return
  }

  // Verificar se é a logo ativa
  if (logo.is_active) {
    toast.error(t('logo.cannotDeleteActive'))
    return
  }

  logoToDelete.value = logo
  showLogoDeleteModal.value = true
}

// Delete logo
const deleteLogo = async () => {
  if (!logoToDelete.value) return

  logoDeleting.value = true

  try {
    await axios.delete(
      `${API_URL}/settings/logos/${logoToDelete.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    // Refresh logos
    await fetchLogos()

    // Close modal
    showLogoDeleteModal.value = false
    logoToDelete.value = null

    // Show success message
    toast.success(t('logo.deleteSuccess'))
  } catch (err) {
    console.error('Error deleting logo:', err)

    // Verificar se é o erro específico de tentar excluir a única logo ou a logo ativa
    if (err.response && err.response.status === 409 && err.response.data && err.response.data.message) {
      if (err.response.data.message.includes('Cannot delete the only logo')) {
        toast.error(t('logo.cannotDeleteOnly'))
      } else if (err.response.data.message.includes('Cannot delete the active logo')) {
        toast.error(t('logo.cannotDeleteActive'))
      } else {
        toast.error(t('logo.deleteError'))
      }
    } else {
      toast.error(t('logo.deleteError'))
    }
  } finally {
    logoDeleting.value = false
  }
}

// Fetch brands
const fetchBrands = async () => {
  loading.value.brands = true
  error.value.brands = null

  try {
    const response = await axios.get(`${API_URL}/settings/brands`)
    brands.value = response.data
  } catch (err) {
    console.error('Error fetching brands:', err)
    error.value.brands = t('brand.fetchError')
    toast.error(error.value.brands)
  } finally {
    loading.value.brands = false
  }
}

// Open brand modal
const openBrandModal = (brand = null) => {
  editingBrand.value = brand

  if (brand) {
    // Edit existing brand
    Object.keys(brandForm).forEach(key => {
      brandForm[key] = brand[key]
    })
  } else {
    // Add new brand
    Object.keys(brandForm).forEach(key => {
      if (key === 'isActive') {
        brandForm[key] = true
      } else if (key === 'position') {
        // Set position to the next available position
        const positions = brands.value.map(b => b.position)
        brandForm[key] = positions.length > 0 ? Math.max(...positions) + 1 : 0
      } else {
        brandForm[key] = ''
      }
    })
  }

  brandImagePreview.value = null
  brandSelectedFileName.value = ''
  showBrandModal.value = true
}

// Close brand modal
const closeBrandModal = () => {
  showBrandModal.value = false
  editingBrand.value = null
}

// Handle brand image change
const handleBrandImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    const allowedTypes = ['image/png', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('brand.invalidImageType'))
      event.target.value = ''
      return
    }

    // Validate file size (max 1MB)
    const maxSize = 1 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('brand.imageTooLarge'))
      event.target.value = ''
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      brandImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    brandSelectedFileName.value = file.name
  } else {
    brandImagePreview.value = null
    brandSelectedFileName.value = ''
  }
}

// Save brand
const saveBrand = async () => {
  brandSaving.value = true

  try {
    // Upload image if a new one was selected
    if (brandImagePreview.value && brandSelectedFileName.value) {
      const formData = new FormData()
      formData.append('file', document.getElementById('brandImage').files[0])

      const uploadResponse = await axios.post(
        `${API_URL}/settings/brands/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      brandForm.logo = uploadResponse.data.url
    }

    if (editingBrand.value) {
      // Update existing brand
      await axios.put(
        `${API_URL}/settings/brands/${editingBrand.value.id}`,
        brandForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    } else {
      // Create new brand
      await axios.post(
        `${API_URL}/settings/brands`,
        brandForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    }

    // Refresh brands
    await fetchBrands()

    // Close modal
    closeBrandModal()

    // Show success message
    toast.success(t(editingBrand.value ? 'brand.updateSuccess' : 'brand.createSuccess'))
  } catch (err) {
    console.error('Error saving brand:', err)
    toast.error(t('brand.saveError'))
  } finally {
    brandSaving.value = false
  }
}

// Confirm delete brand
const confirmDeleteBrand = (brand) => {
  brandToDelete.value = brand
  showBrandDeleteModal.value = true
}

// Delete brand
const deleteBrand = async () => {
  if (!brandToDelete.value) return

  brandDeleting.value = true

  try {
    await axios.delete(
      `${API_URL}/settings/brands/${brandToDelete.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    // Refresh brands
    await fetchBrands()

    // Close modal
    showBrandDeleteModal.value = false
    brandToDelete.value = null

    // Show success message
    toast.success(t('brand.deleteSuccess'))
  } catch (err) {
    console.error('Error deleting brand:', err)
    toast.error(t('brand.deleteError'))
  } finally {
    brandDeleting.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  fetchBanners()
  fetchLogos()
  fetchBrands()
})
</script>
