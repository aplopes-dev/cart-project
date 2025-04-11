<template>
  <header :class="[
    'w-full z-[100]',
    { 'fixed bg-black/30': isHomePage, 'relative bg-black': !isHomePage }
  ]">
    <div class="relative flex flex-col items-center px-4 py-1.5 w-full !bg-black/30"> <!-- Reduzido py-3 para py-1.5 -->
      <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-0 md:px-8 py-1.5"> <!-- Alterado px-4 para px-0 -->
        <!-- Logo e Botões Mobile -->
        <div class="flex flex-col w-full md:w-auto">
          <!-- Primeira linha: Logo, Email, Phone e Menu Sanduíche -->
          <div class="flex justify-end items-center w-full">
            <router-link to="/" class="mr-auto pl-0 md:pl-4"> <!-- Adicionado pl-0 para mobile e pl-4 para desktop -->
              <img
                :src="logoUrl"
                alt="Logo"
                class="w-[180px] h-[103.28px] object-contain"
                @error="handleImageError"
              >
            </router-link>

            <!-- Container dos ícones mobile -->
            <div class="flex items-center md:gap-6 gap-2 md:ml-0 md:hidden"> <!-- Corrigido a ordem das classes -->
              <!-- Language Selector Mobile -->
              <div class="relative md:hidden">
                <button
                  @click="toggleLanguageDropdown"
                  class="language-selector flex items-center gap-2 bg-transparent cursor-pointer p-1"
                >
                  <img
                    :src="flagImages[selectedLanguage]"
                    class="w-7 h-7"
                    :alt="`${selectedLanguage} flag`"
                  />
                  <svg
                    class="w-4 h-4"
                    :class="{ 'transform rotate-180': isLanguageDropdownOpen }"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>

                <!-- Dropdown Mobile -->
                <div
                  v-show="isLanguageDropdownOpen"
                  class="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50 min-w-[100px]"
                >
                  <button
                    v-for="lang in availableLanguages"
                    :key="lang"
                    @click="selectLanguage(lang)"
                    class="flex items-center justify-center w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <img
                      :src="flagImages[lang]"
                      class="w-6 h-6"
                      :alt="`${lang} flag`"
                    />
                  </button>
                </div>
              </div>

              <!-- Email com tooltip -->
              <div class="relative">
                <button
                  class="flex items-center"
                  @mouseenter="showEmailTooltip = true"
                  @mouseleave="showEmailTooltip = false"
                  @click="showEmailTooltip = !showEmailTooltip"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                </button>
                <div
                  v-show="showEmailTooltip"
                  class="absolute right-0 top-8 bg-black/90 text-white px-4 py-2 rounded-lg whitespace-nowrap z-50"
                >
                  {{ companyData.email }}
                </div>
              </div>

              <!-- Phone com tooltip -->
              <div class="relative">
                <button
                  class="flex items-center"
                  @mouseenter="showPhoneTooltip = true"
                  @mouseleave="showPhoneTooltip = false"
                  @click="showPhoneTooltip = !showPhoneTooltip"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </button>
                <div
                  v-show="showPhoneTooltip"
                  class="absolute right-0 top-8 bg-black/90 text-white px-4 py-2 rounded-lg whitespace-nowrap z-50"
                >
                  {{ companyData.phone }}
                </div>
              </div>

              <!-- Menu Button -->
              <button class="md:hidden flex items-center" @click="toggleMobileMenu">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Segunda linha: Carrinho e Sign in (apenas mobile) -->
          <div class="flex md:hidden justify-end items-center gap-6 mt-0.5">
            <button @click="toggleCart" class="relative flex items-center">
              <div v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-empire-yellow text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {{ cartStore.itemCount }}
              </div>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </button>
            <template v-if="isAuthenticated">
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="user-menu text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-2"
                >
                  {{ $t('header.greeting') }}{{ currentUser?.firstName ? `, ${currentUser.firstName}` : '' }}
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>

                <!-- User Dropdown Menu Mobile -->
                <div
                  v-show="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <router-link
                    to="/my-account"
                    class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M20 21v-2a4 4 0 01-4-4H8a4 4 0 01-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {{ $t('header.myAccount') }}
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    {{ $t('header.logout') }}
                  </button>
                </div>
              </div>
            </template>

            <router-link
              v-else
              to="/login"
              class="text-[15px] leading-7 text-white font-archivo font-medium"
            >
              {{ $t('header.signIn') }}
            </router-link>
          </div>
        </div>

        <!-- Desktop Navigation and Actions -->
        <div class="hidden md:flex items-center gap-6">
          <div class="flex flex-row items-center gap-8 w-[471px] h-[56px] mx-auto">
            <!-- Phone -->
            <div class="flex flex-row items-center gap-4 w-[205px] h-[56px]">
              <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-[150px] p-[10px]">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div class="flex flex-col justify-center w-[137px] h-[56px]">
                <span class="font-archivo font-medium text-[15px] leading-7 text-empire-yellow">{{ $t('header.callUsToday') }}</span>
                <span class="font-archivo font-bold text-[19px] leading-7 text-white">{{ companyData.phone }}</span>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-row items-center gap-4 w-[234px] h-[56px]">
              <div class="flex justify-center items-center w-[52px] h-[53px] border-2 border-white rounded-[150px] p-[10px]">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </div>
              <div class="flex flex-col justify-center w-[166px] h-[56px]">
                <span class="font-archivo font-medium text-[15px] leading-7 text-empire-yellow">{{ $t('header.chatWithUs') }}</span>
                <span class="font-archivo font-bold text-[19px] leading-7 text-white">{{ companyData.email }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lower Section - Navigation -->
      <div class="hidden md:flex flex-col md:flex-row justify-between items-center w-full max-w-[1408px] px-4 py-1.5 border-t border-[rgba(78,78,78,0.35)]"> <!-- Reduzido py-3 para py-1.5 -->
        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 mb-4 md:mb-0">
          <router-link to="/" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.home') }}
          </router-link>
          <router-link to="/history" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.history') }}
          </router-link>
          <router-link to="/suppliers" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.suppliers') }}
          </router-link>
          <div class="relative category-dropdown">
            <button
              @click="toggleCategoryDropdown"
              class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1"
            >
              {{ $t('header.shop') }}
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': showCategoryDropdown }"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Categories Dropdown -->
            <div
              v-if="showCategoryDropdown"
              class="absolute top-full left-0 mt-2 w-64 bg-black rounded-md shadow-lg py-1 z-50 max-h-[500px] overflow-y-auto"
            >
              <!-- Loading State -->
              <div v-if="loading" class="px-4 py-2 text-empire-yellow">
                {{ $t('common.loading') }}...
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="px-4 py-2 text-red-500">
                {{ $t('common.error') }}
              </div>

              <!-- Empty State -->
              <div v-else-if="categories.length === 0" class="px-4 py-2 text-empire-yellow">
                {{ $t('common.noCategories') }}
              </div>

              <!-- Categories List (Recursive Component) -->
              <template v-else>
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="category-item"
                >
                  <div
                    :class="[
                      'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide',
                      category.expanded ? 'bg-amber-600 text-white' : 'text-white hover:bg-empire-yellow hover:text-black'
                    ]"
                  >
                    <!-- Category Name (truncated if needed) -->
                    <div
                      class="whitespace-nowrap overflow-hidden truncate w-[180px]"
                      :title="category.name"
                      @click.stop="navigateToCategory(category.id)"
                    >
                      {{ category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name }}
                    </div>

                    <!-- Expand/Collapse Icon (only if has children) -->
                    <div
                      v-if="category.children && category.children.length > 0"
                      @click.stop="toggleCategoryExpansion(category)"
                      class="flex items-center justify-center w-6 h-6"
                    >
                      <svg
                        class="w-4 h-4 transition-transform duration-200"
                        :class="{ 'transform rotate-180': category.expanded }"
                        viewBox="0 0 24 24"
                        :fill="category.expanded ? '#FFFFFF' : '#FBBD1E'"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Subcategories (recursive) -->
                  <div
                    v-if="category.children && category.children.length > 0 && category.expanded"
                    class="pl-4 bg-amber-600"
                  >
                    <div
                      v-for="subcategory in category.children"
                      :key="subcategory.id"
                      class="category-item"
                    >
                      <div
                        :class="[
                          'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium',
                          subcategory.expanded ? 'bg-amber-600 text-white' : 'text-black hover:bg-empire-yellow hover:text-black'
                        ]"
                      >
                        <!-- Subcategory Name (truncated if needed) -->
                        <div
                          class="whitespace-nowrap overflow-hidden truncate w-[160px]"
                          :title="subcategory.name"
                          @click.stop="navigateToCategory(subcategory.id)"
                        >
                          {{ subcategory.name.length > 18 ? subcategory.name.substring(0, 18) + '...' : subcategory.name }}
                        </div>

                        <!-- Expand/Collapse Icon (only if has children) -->
                        <div
                          v-if="subcategory.children && subcategory.children.length > 0"
                          @click.stop="toggleSubcategoryExpansion(subcategory, category)"
                          class="flex items-center justify-center w-6 h-6"
                        >
                          <svg
                            class="w-4 h-4 transition-transform duration-200"
                            :class="{ 'transform rotate-180': subcategory.expanded }"
                            viewBox="0 0 24 24"
                            :fill="subcategory.expanded ? '#FFFFFF' : '#FBBD1E'"
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </div>
                      </div>

                      <!-- Third level categories -->
                      <div
                        v-if="subcategory.children && subcategory.children.length > 0 && subcategory.expanded"
                        class="pl-4 bg-amber-600"
                      >
                        <div
                          v-for="thirdLevel in subcategory.children"
                          :key="thirdLevel.id"
                          class="px-4 py-2 text-white hover:bg-empire-yellow hover:text-black cursor-pointer transition-colors duration-200 font-medium"
                          @click.stop="navigateToCategory(thirdLevel.id)"
                        >
                          <div
                            class="whitespace-nowrap overflow-hidden truncate w-[140px]"
                            :title="thirdLevel.name"
                          >
                            {{ thirdLevel.name.length > 16 ? thirdLevel.name.substring(0, 16) + '...' : thirdLevel.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <router-link to="/career" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.career') }}
          </router-link>
          <router-link to="/contact" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.contactUs') }}
          </router-link>
        </nav>

        <!-- Right Section -->
        <div class="flex flex-wrap justify-center items-center gap-4">
          <!-- Language Desktop (ícones + texto) -->
          <div class="relative hidden md:block">
            <button
              @click="toggleLanguageDropdown"
              class="language-selector flex items-center gap-2 text-[15px] leading-7 text-white font-archivo font-medium bg-transparent cursor-pointer pl-2 pr-6"
            >
              <img
                :src="flagImages[selectedLanguage]"
                class="w-5 h-5"
                :alt="`${selectedLanguage} flag`"
              />
              {{ selectedLanguage }}
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': isLanguageDropdownOpen }"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Dropdown Desktop -->
            <div
              v-show="isLanguageDropdownOpen"
              class="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50 min-w-[100px]"
            >
              <button
                v-for="lang in availableLanguages"
                :key="lang"
                @click="selectLanguage(lang)"
                class="flex items-center gap-2 w-full px-4 py-2 text-black hover:bg-gray-100"
              >
                <img
                  :src="flagImages[lang]"
                  class="w-5 h-5"
                  :alt="`${lang} flag`"
                />
                {{ lang }}
              </button>
            </div>
          </div>

          <!-- Cart and Sign In -->
          <div class="flex items-center gap-6">
            <button @click="toggleCart" class="relative flex items-center">
              <div v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-empire-yellow text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {{ cartStore.itemCount }}
              </div>
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </button>
            <template v-if="isAuthenticated">
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="user-menu text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1"
                >
                  {{ $t('header.greeting') }}{{ currentUser?.firstName ? `, ${currentUser.firstName}` : '' }}
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>

                <!-- User Dropdown Menu -->
                <div
                  v-show="isUserMenuOpen"
                  class="absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50 max-h-[500px] overflow-y-auto"
                >
                  <router-link
                    to="/my-account"
                    class="flex items-center gap-2 w-full px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide text-white hover:bg-empire-yellow hover:text-black"
                  >
                    <svg
                      class="w-5 h-5 transition-colors duration-200"
                      viewBox="0 0 24 24"
                      fill="#FFDD00"
                      :class="{'group-hover:fill-black': true}"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    {{ $t('header.myAccount') }}
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="flex items-center gap-2 w-full px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide text-white hover:bg-empire-yellow hover:text-black"
                  >
                    <svg
                      class="w-5 h-5 transition-colors duration-200"
                      viewBox="0 0 24 24"
                      fill="#FFDD00"
                      :class="{'group-hover:fill-black': true}"
                    >
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    {{ $t('header.logout') }}
                  </button>
                </div>
              </div>
            </template>

            <router-link
              v-else
              to="/login"
              class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1"
            >
              {{ $t('header.signIn') }}
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </router-link>
          </div>

          <!-- Projetos Dropdown (apenas para usuários logados) -->
          <div v-if="isAuthenticated" class="relative projects-dropdown hidden md:block">
            <button
              @click="toggleProjectsDropdown"
              class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1"
            >
              Projetos
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': showProjectsDropdown }"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Projetos Dropdown -->
            <div
              v-if="showProjectsDropdown"
              class="absolute top-full left-0 mt-2 w-64 bg-black rounded-md shadow-lg py-1 z-50 max-h-[500px] overflow-y-auto"
            >
              <!-- Lista de Projetos -->
              <div
                v-for="project in projects"
                :key="project.id"
                class="category-item"
              >
                <div
                  class="flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide text-white hover:bg-empire-yellow hover:text-black"
                >
                  <!-- Nome do Projeto -->
                  <div
                    class="whitespace-nowrap overflow-hidden truncate w-[180px]"
                    :title="project.name"
                  >
                    {{ project.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search - Desktop -->
          <div class="relative hidden md:block">
            <div class="flex items-center justify-between px-4 py-2 w-full md:w-[300px] h-[42px] border-2 border-white rounded-full bg-opacity-20 backdrop-blur-sm">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('header.searchPlaceholder')"
                @input="handleSearchInput"
                @keydown.down="navigateResults('down')"
                @keydown.up="navigateResults('up')"
                @keydown.esc="closeSearch"
                class="bg-transparent text-[15px] leading-7 text-white font-archivo font-medium w-full focus:outline-none placeholder-white/70"
                ref="searchInput"
              />
              <button @click="handleSearch" class="hover:opacity-80 transition-opacity">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Resultados da busca -->
            <div
              v-if="showAutocomplete"
              class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl mt-2 max-h-[400px] overflow-y-auto z-50 border border-gray-200"
            >
              <!-- Loading state -->
              <div v-if="isSearching" class="p-4 text-center text-gray-600">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full"></div>
              </div>

              <!-- Results -->
              <div v-else-if="filteredProducts.length > 0">
                <div
                  v-for="(product, index) in filteredProducts"
                  :key="product.id"
                  @click="selectProduct(product)"
                  @mouseenter="selectedIndex = index"
                  :class="[
                    'flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200',
                    selectedIndex === index ? 'bg-gray-200 text-black font-bold' : 'hover:bg-gray-200 hover:text-black hover:font-bold'
                  ]"
                >
                  <div class="relative w-12 h-12 flex-shrink-0">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-full h-full object-cover rounded"
                      @error="e => e.target.src = PLACEHOLDER_IMAGE_PATH"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-archivo font-medium truncate transition-colors duration-200">
                      <span v-html="highlightMatch(product.name, searchQuery)"></span>
                    </div>
                    <div v-if="showPrices" class="text-primary font-medium text-sm">{{ formatPrice(product.price) }}</div>
                  </div>
                </div>
              </div>

              <!-- No results -->
              <div
                v-else-if="searchQuery && !isSearching"
                class="p-4 text-center text-gray-600"
              >
                <div class="text-sm">Nenhum produto encontrado</div>
                <div class="text-xs mt-1 text-gray-500">Tente buscar com outros termos</div>
              </div>
            </div>
          </div>

          <!-- Search - Mobile -->
          <div class="md:hidden w-full px-4 mb-4">
            <div class="relative flex items-center w-full">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('header.searchPlaceholder')"
                @input="handleSearchInput"
                @keydown.down="navigateResults('down')"
                @keydown.up="navigateResults('up')"
                @keydown.esc="closeSearch"
                class="w-full px-4 py-2 h-[42px] bg-transparent border-2 border-white rounded-full text-white font-archivo text-[15px] leading-7 focus:outline-none placeholder-white/70"
              />
              <button
                @click="handleSearch"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Mobile Results -->
            <div
              v-if="showAutocomplete"
              class="absolute left-4 right-4 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-50 max-h-[60vh] overflow-y-auto border border-gray-200"
            >
              <!-- Loading state -->
              <div v-if="isSearching" class="p-4 text-center text-gray-600">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full"></div>
              </div>

              <!-- Results -->
              <div v-else-if="filteredProducts.length > 0">
                <div
                  v-for="(product, index) in filteredProducts"
                  :key="product.id"
                  @click="selectProduct(product)"
                  @mouseenter="selectedIndex = index"
                  :class="[
                    'flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200',
                    selectedIndex === index ? 'bg-gray-200 text-black font-bold' : 'hover:bg-gray-200 hover:text-black hover:font-bold'
                  ]"
                >
                  <div class="relative w-12 h-12 flex-shrink-0">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-full h-full object-cover rounded"
                      @error="e => e.target.src = PLACEHOLDER_IMAGE_PATH"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-archivo font-medium truncate transition-colors duration-200">
                      <span v-html="highlightMatch(product.name, searchQuery)"></span>
                    </div>
                    <div class="text-primary font-medium text-sm">{{ formatPrice(product.price) }}</div>
                  </div>
                </div>
              </div>

              <!-- No results -->
              <div
                v-else-if="searchQuery && !isSearching"
                class="p-4 text-center text-gray-600"
              >
                <div class="text-sm">Nenhum produto encontrado</div>
                <div class="text-xs mt-1 text-gray-500">Tente buscar com outros termos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden w-full">
        <!-- Navigation Links Mobile -->
        <nav class="grid grid-cols-4 gap-2 w-full py-4 border-t border-[rgba(78,78,78,0.35)]">
          <router-link to="/" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">
            {{ $t('header.home') }}
          </router-link>
          <router-link to="/history" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">
            {{ $t('header.history') }}
          </router-link>
          <!-- Menu Loja mobile -->
          <div class="md:hidden category-dropdown relative">
            <button
              @click="toggleCategoryDropdown"
              class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center w-full flex items-center justify-center gap-1"
            >
              {{ $t('header.shop') }}
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': showCategoryDropdown }"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Dropdown do menu Loja -->
            <div
              v-if="showCategoryDropdown"
              class="absolute bg-white shadow-lg z-50 rounded-lg mt-12 left-1/2 transform -translate-x-1/2"
              style="width: 250px;"
            >
              <div class="max-h-[50vh] overflow-y-auto py-1">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  @click="navigateToCategory(category.id)"
                  class="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-empire-yellow cursor-pointer transition-colors duration-200 text-center"
                >
                  {{ category.name }}
                </div>
              </div>
            </div>
          </div>
          <router-link to="/suppliers" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">
            {{ $t('header.suppliers') }}
          </router-link>
          <router-link to="/career" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">
            {{ $t('header.career') }}
          </router-link>
          <router-link to="/contact" class="px-1 py-2 text-[15px] leading-7 text-white font-archivo font-medium text-center">
            {{ $t('header.contactUs') }}
          </router-link>

          <!-- Mobile Search Button -->
          <div class="md:hidden col-span-4 mx-4 mt-2">
            <div class="relative flex items-center w-full">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('header.searchPlaceholder')"
                @input="handleSearchInput"
                class="w-full px-4 py-2 h-[42px] bg-transparent border-2 border-white rounded-full text-white font-archivo text-[15px] leading-7 focus:outline-none"
              />
              <button
                class="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Autocomplete dropdown para mobile -->
            <div
              v-if="showAutocomplete && filteredProducts.length > 0"
              class="absolute left-0 right-0 mt-2 mx-4 bg-white rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto"
            >
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                @click="selectProduct(product)"
                class="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div class="text-black font-archivo font-medium">{{ product.name }}</div>
                  <div v-if="showPrices" class="text-gray-600 text-sm">{{ formatPrice(product.price) }}</div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <!-- Cart Widget -->
    <CartWidget v-if="cartStore.isOpen" />
  </header>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import CartWidget from '../cart/CartWidget.vue'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { debounce } from 'lodash'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'
import api from '@/services/api'
import eventBus from '@/utils/eventBus'

const router = useRouter()
const route = useRoute()
const store = useStore()
const cartStore = useCartStore()
const togglesStore = useFinancialTogglesStore()
const { locale } = useI18n()

// Variável para controlar a exibição de preços
const showPrices = ref(true)

// Modifique os computeds e adicione um ref para controle de estado
const authState = ref({
  isAuthenticated: false,
  user: null
})

// Função para atualizar o estado de autenticação
const updateAuthState = () => {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')

  authState.value = {
    isAuthenticated: !!token,
    user: userData ? JSON.parse(userData) : null
  }
}

// Computed properties atualizadas
const isAuthenticated = computed(() => authState.value.isAuthenticated)

const currentUser = computed(() => authState.value.user)

// Estado
const isMobileMenuOpen = ref(false)
const isLanguageDropdownOpen = ref(false)
const isUserMenuOpen = ref(false)
const selectedLanguage = ref(localStorage.getItem('selectedLanguage') || 'FR')
const searchQuery = ref('')
const filteredProducts = ref([])
const showAutocomplete = ref(false)
const showCategoryDropdown = ref(false)
const showProjectsDropdown = ref(false)
const logoUrl = ref('/images/logo/logo.png')
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const isSearching = ref(false)
const selectedIndex = ref(-1)
const expandedCategoryId = ref(null) // ID da categoria atualmente expandida
const expandedSubcategoryId = ref(null) // ID da subcategoria atualmente expandida

// Adicione esta ref para os dados da empresa
const companyData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// Dados mockados de projetos
const projects = ref([
  { id: 1, name: 'Projeto 1', description: 'Descrição do Projeto 1' },
  { id: 2, name: 'Projeto 2', description: 'Descrição do Projeto 2' },
  { id: 3, name: 'Projeto 3', description: 'Descrição do Projeto 3' },
  { id: 4, name: 'Projeto 4', description: 'Descrição do Projeto 4' },
  { id: 5, name: 'Projeto 5', description: 'Descrição do Projeto 5' }
])

// Função para carregar as configurações financeiras
const loadFinancialSettings = async () => {
  try {
    const settings = await settingsService.getFinancialSettings()

    // Carrega o estado dos toggles
    togglesStore.loadTogglesFromBackend({
      currency_code_enabled: settings.currency_code_enabled,
      currency_symbol_enabled: settings.currency_symbol_enabled,
      tax_rate_enabled: settings.tax_rate_enabled,
      discount_percentage_enabled: settings.discount_percentage_enabled,
      min_order_value_enabled: settings.min_order_value_enabled,
      free_shipping_threshold_enabled: settings.free_shipping_threshold_enabled,
      shipping_cost_enabled: settings.shipping_cost_enabled,
      master_toggle_enabled: settings.master_toggle_enabled
    })

    // Atualiza a visibilidade dos preços com base no toggle master
    showPrices.value = togglesStore.masterToggle
    console.log('[Header] Master toggle state:', togglesStore.masterToggle)
    console.log('[Header] Show prices:', showPrices.value)
  } catch (error) {
    console.error('Error loading financial settings:', error)
  }
}

// Constantes
const flagImages = {
  'EN': '/images/flags/US.svg',
  'FR': '/images/flags/FR.svg',
  'PT': '/images/flags/BR.svg'
}

const availableLanguages = ['FR', 'EN', 'PT']

// Computed Properties
const isHomePage = computed(() => route.path === '/')

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleImageError = (e) => {
  console.error('Error loading image:', e)
  e.target.src = 'https://via.placeholder.com/180x103?text=Logo'
  e.target.onerror = null
}

const toggleCart = () => {
  cartStore.toggleCart()
}



const selectProduct = (product) => {
  router.push(`/product/${product.id}`)
  searchQuery.value = ''
  showAutocomplete.value = false
  if (isMobileMenuOpen.value) {
    toggleMobileMenu()
  }
}

// Método para toggle do dropdown de categorias
const toggleCategoryDropdown = (event) => {
  event.stopPropagation()
  showCategoryDropdown.value = !showCategoryDropdown.value
  // Fecha os outros dropdowns quando abrir este
  if (showCategoryDropdown.value) {
    isLanguageDropdownOpen.value = false
    isUserMenuOpen.value = false
    showProjectsDropdown.value = false
  }
}

// Método para toggle do dropdown de projetos
const toggleProjectsDropdown = (event) => {
  event.stopPropagation()
  showProjectsDropdown.value = !showProjectsDropdown.value
  // Fecha os outros dropdowns quando abrir este
  if (showProjectsDropdown.value) {
    isLanguageDropdownOpen.value = false
    isUserMenuOpen.value = false
    showCategoryDropdown.value = false
  }
}

// Método para navegação de categoria
const navigateToCategory = (categoryId) => {
  router.push(`/categories/${categoryId}`)
  showCategoryDropdown.value = false
  if (isMobileMenuOpen.value) {
    toggleMobileMenu()
  }
}

// Método para logout
const handleLogout = async () => {
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  if (userId) {
    try {
      // Recupera os dados do carrinho do localStorage antes de apagar
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        if (cartItems.length > 0) {
          // Sincroniza com o backend antes de limpar
          await cartStore.syncCartWithBackend();
          console.log('Cart synced before logout');
        }
      }
    } catch (error) {
      console.error('Error syncing cart before logout:', error);
    }
  }

  await store.dispatch('logout');
  isUserMenuOpen.value = false;
  showProjectsDropdown.value = false;

  // Remove os dados do carrinho do localStorage
  localStorage.removeItem(`cart_${userId}`);
  localStorage.removeItem('user');

  // Reset do estado do carrinho
  cartStore.$reset();

  updateAuthState();
  router.replace('/');
}

const toggleUserMenu = (event) => {
  event.stopPropagation()
  isUserMenuOpen.value = !isUserMenuOpen.value
  // Fecha os outros dropdowns quando abrir este
  if (isUserMenuOpen.value) {
    isLanguageDropdownOpen.value = false
    showCategoryDropdown.value = false
    showProjectsDropdown.value = false
  }
}

// Função para buscar categorias
const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('[Header] Iniciando carregamento de categorias')

    // Buscar todas as categorias
    const allCategories = await categoryService.getCategories()
    console.log(`[Header] Recebidas ${allCategories.length} categorias da API`)

    // Buscar contagem de produtos por categoria
    const topCategories = await categoryService.getTopCategoriesWithMostProducts(100)
    console.log(`[Header] Recebidas ${topCategories.length} categorias com contagem de produtos`)

    // Criar um mapa de contagem de produtos por categoria
    const productCountMap = {}
    topCategories.forEach(category => {
      productCountMap[category.id] = category.productCount
    })

    // Construir a árvore de categorias
    const categoryTree = categoryService.buildCategoryTree(allCategories)

    // Filtrar categorias sem produtos
    const filteredCategoryTree = categoryService.filterCategoryTree(categoryTree, productCountMap)

    // Usar a árvore filtrada como categorias
    categories.value = filteredCategoryTree

    // Inicializar o estado de expansão para cada categoria
    initializeCategoryExpansionState(categories.value)

    console.log(`[Header] Árvore de categorias filtrada com ${categories.value.length} categorias raiz`)
  } catch (err) {
    console.error('Error fetching categories:', err)
    error.value = 'Error loading categories'
    categories.value = []
  } finally {
    loading.value = false
  }
}

// Função para inicializar o estado de expansão das categorias
const initializeCategoryExpansionState = (categories) => {
  categories.forEach(category => {
    // Definir o estado de expansão como false para todas as categorias
    category.expanded = false

    // Recursivamente inicializar subcategorias
    if (category.children && category.children.length > 0) {
      initializeCategoryExpansionState(category.children)
    }
  })
}

// Função para expandir uma categoria e contrair as outras
const toggleCategoryExpansion = (category) => {
  // Se a categoria já está expandida, apenas contrai
  if (category.expanded) {
    category.expanded = false
    expandedCategoryId.value = null
    return
  }

  // Contrai todas as categorias de primeiro nível
  categories.value.forEach(cat => {
    cat.expanded = false
  })

  // Expande apenas a categoria clicada
  category.expanded = true
  expandedCategoryId.value = category.id
}

// Função para expandir uma subcategoria e contrair as outras
const toggleSubcategoryExpansion = (subcategory, parentCategory) => {
  // Se a subcategoria já está expandida, apenas contrai
  if (subcategory.expanded) {
    subcategory.expanded = false
    expandedSubcategoryId.value = null
    return
  }

  // Contrai todas as subcategorias do mesmo pai
  if (parentCategory.children) {
    parentCategory.children.forEach(subcat => {
      subcat.expanded = false
    })
  }

  // Expande apenas a subcategoria clicada
  subcategory.expanded = true
  expandedSubcategoryId.value = subcategory.id
}

// Funções para o seletor de idiomas
const toggleLanguageDropdown = (event) => {
  event.stopPropagation()
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
  // Fecha outros dropdowns quando abrir este
  if (isLanguageDropdownOpen.value) {
    isUserMenuOpen.value = false
    showCategoryDropdown.value = false
    showProjectsDropdown.value = false
  }
}

const selectLanguage = (lang) => {
  selectedLanguage.value = lang
  isLanguageDropdownOpen.value = false
  locale.value = lang.toLowerCase()
}

// Event listener para fechar dropdowns ao clicar fora
const handleClickOutside = (event) => {
  const languageSelector = event.target.closest('.language-selector')
  const userMenu = event.target.closest('.user-menu')
  const categoryDropdown = event.target.closest('.category-dropdown')
  const projectsDropdown = event.target.closest('.projects-dropdown')

  if (!languageSelector && !userMenu && !categoryDropdown && !projectsDropdown) {
    isLanguageDropdownOpen.value = false
    isUserMenuOpen.value = false
    showCategoryDropdown.value = false
    showProjectsDropdown.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watchers
watch(selectedLanguage, (newValue) => {
  locale.value = newValue.toLowerCase()
  // Salvar o idioma selecionado no localStorage
  localStorage.setItem('selectedLanguage', newValue)
}, { immediate: true })

watch(searchQuery, (newValue) => {
  showAutocomplete.value = newValue.length > 0
})

watch(isMobileMenuOpen, (newValue) => {
  if (!newValue) {
    showAutocomplete.value = false
    searchQuery.value = ''
    showCategoryDropdown.value = false
  }
})

watch(
  () => localStorage.getItem('token'),
  () => {
    // Força reavaliação do estado de autenticação
    isAuthenticated.value = !!localStorage.getItem('token')
  }
)

// Lifecycle Hooks
onMounted(async () => {
  // Carregar configurações financeiras
  await loadFinancialSettings()

  // Carregar categorias
  await fetchCategories()

  const handleClickOutside = (event) => {
    const languageButton = event.target.closest('.language-selector')
    const userButton = event.target.closest('.user-menu')
    const categoryButton = event.target.closest('.category-dropdown')

    if (!languageButton && !userButton && !categoryButton) {
      isLanguageDropdownOpen.value = false
      isUserMenuOpen.value = false
      showCategoryDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', (e) => {
    const target = e.target
    if (!target.closest('.language-selector')) {
      isLanguageDropdownOpen.value = false
    }
    if (!target.closest('.category-dropdown')) {
      showCategoryDropdown.value = false
    }
  })
})

// Verifica o token a cada renderização do componente
onMounted(() => {
  updateAuthState()

  const interval = setInterval(() => {
    updateAuthState()
  }, 1000) // Verifica a cada segundo

  onUnmounted(() => {
    clearInterval(interval)
  })
})

// Adicione um watcher para a rota
watch(
  () => route.path,
  () => {
    updateAuthState()
  }
)

// Adicione um watcher para o estado de autenticação
watch(() => authState.value.isAuthenticated, (newValue) => {
  if (newValue) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id
    if (userId) {
      cartStore.loadCartFromStorage(userId)
    }
  }
})

// Adicione esta função para buscar produtos
const searchProducts = async (query) => {
  if (!query || query.length < 2) {
    filteredProducts.value = []
    showAutocomplete.value = false
    return
  }

  try {
    isSearching.value = true
    const response = await productService.getProducts({
      search: query,  // Aqui está o parâmetro que estava faltando
      limit: 5
    })
    filteredProducts.value = response.items || []
    showAutocomplete.value = true
  } catch (error) {
    console.error('Error searching products:', error)
    filteredProducts.value = []
  } finally {
    isSearching.value = false
  }
}

// Adicione o debounce para a busca
const debouncedSearch = debounce(searchProducts, 300)

// Adicione este watch
watch(searchQuery, (newValue) => {
  debouncedSearch(newValue)
})

// Adicione esta função para formatar o preço
const formatPrice = (price) => {
  const numPrice = Number(price)
  return !isNaN(numPrice)
    ? `$${numPrice.toFixed(2)}`
    : '$0.00'
}

// Adicione esta função para destacar a correspondência na busca
const highlightMatch = (text, query) => {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<span class="!text-primary!">$1</span>')
}

// Adicione esta função para navegar pelos resultados da busca
const navigateResults = (direction) => {
  if (!showAutocomplete.value || !filteredProducts.value.length) return

  if (direction === 'down') {
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredProducts.value.length - 1)
  } else if (direction === 'up') {
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  }

  // Se pressionar enter com um item selecionado
  if (selectedIndex.value >= 0) {
    const selectedProduct = filteredProducts.value[selectedIndex.value]
    if (selectedProduct) {
      selectProduct(selectedProduct)
    }
  }
}

// Adicione esta função para fechar a busca
const closeSearch = () => {
  showAutocomplete.value = false
  searchQuery.value = ''
  selectedIndex.value = -1
}

// Modifique a função handleSearchInput existente
const handleSearchInput = (event) => {
  const value = event.target.value.trim()
  selectedIndex.value = -1 // Reset selection on new input

  if (value.length >= 2) {
    debouncedSearch(value)
  } else {
    filteredProducts.value = []
    showAutocomplete.value = false
  }
}

// Watch para atualizar a visibilidade dos preços quando o toggle master mudar
watch(() => togglesStore.masterToggle, (newValue) => {
  console.log('[Header] Master toggle changed:', newValue)
  showPrices.value = newValue
})

// Adicione ao watch existente
watch(showAutocomplete, (newValue) => {
  if (!newValue) {
    selectedIndex.value = -1
  }
})

// Adicione esta função para carregar os dados da empresa
const loadCompanyData = async () => {
  try {
    const response = await api.get('/settings/company')
    companyData.value = {
      name: response.data.company_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      address: response.data.address || ''
    }
    console.log('Header company data updated:', companyData.value)
  } catch (err) {
    console.error('Error loading company data:', err)
  }
}

// Adicione o handler do evento
const updateCompanyDataHandler = async () => {
  console.log('Header received company data update event')
  await loadCompanyData()
}

// Atualize onMounted e onUnmounted
onMounted(() => {
  loadCompanyData()
  eventBus.on('company-data-updated', updateCompanyDataHandler)
})

onUnmounted(() => {
  eventBus.off('company-data-updated', updateCompanyDataHandler)
})
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}

.text-empire-yellow {
  color: #FFDD00;
}

select:focus {
  outline: none;
}

select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #fff;
}

select option {
  background-color: #1E1E1E;
  color: white;
  padding: 8px;
}

@media (min-width: 768px) {
  select {
    min-width: 80px;
  }
}

@media (max-width: 767px) {
  select option {
    padding: 8px 24px;
    min-height: 40px;
  }
}

.flag-icon {
  font-size: 1.2rem;
  line-height: 1;
}

select {
  padding-left: 2rem;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .mobile-search {
    position: relative;
    z-index: 50;
  }
}

.mobile-search-overlay {
  backdrop-filter: blur(4px);
}

input {
  color: white;
  caret-color: white;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.user-menu {
  position: relative;
  z-index: 51;
}

.category-dropdown {
  position: relative;
}

/* Estilos específicos para o menu mobile */
@media (max-width: 768px) {
  .category-dropdown {
    position: relative;
    display: flex;
    justify-content: center;
  }
}

.search-container {
  position: relative;
}

:deep(mark) {
  padding: 0;
  background-color: rgba(255, 221, 0, 0.3);
  border-radius: 2px;
}

/* Animações */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar personalizada */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Estilos modernos para todos os menus de navegação */
nav a, .category-dropdown button {
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  font-family: 'Montserrat', 'Archivo', sans-serif;
  letter-spacing: 0.02em;
}

nav a::before, .category-dropdown button::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #FFDD00;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateX(-50%);
}

nav a:hover::before, nav a:focus::before, nav a:active::before,
.category-dropdown button:hover::before, .category-dropdown button:focus::before, .category-dropdown button:active::before {
  width: 80%;
}

nav a:hover, nav a:focus, nav a:active,
.category-dropdown button:hover, .category-dropdown button:focus, .category-dropdown button:active {
  text-shadow: 0 0 10px rgba(255, 221, 0, 0.7);
}

/* Estilo específico para o menu de Loja */
.category-dropdown {
  position: relative;
}

/* Estilo do dropdown principal */
.category-dropdown > div {
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 221, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Estilo para os textos do menu */
.category-item span,
.category-item div[class*="truncate"] {
  transition: all 0.2s ease;
  font-weight: 500;
}

/* Estilo da barra de rolagem para o menu */
.category-dropdown > div::-webkit-scrollbar {
  width: 6px;
}

.category-dropdown > div::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.category-dropdown > div::-webkit-scrollbar-thumb {
  background-color: rgba(255, 221, 0, 0.5);
  border-radius: 3px;
}

.category-dropdown > div:hover {
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}

/* Estilo dos itens do menu */
.category-item > div {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
  font-family: 'Montserrat', 'Archivo', sans-serif;
  letter-spacing: 0.03em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Adiciona um efeito de brilho sutil ao item expandido */
.category-item > div.bg-amber-600 {
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Estilo para os textos nos itens expandidos */
.category-item > div.bg-amber-600 span,
.category-item > div.bg-amber-600 div[class*="truncate"] {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  letter-spacing: 0.04em;
}

/* Adiciona um efeito de borda ao item com hover */
.category-item > div:hover:not(.bg-amber-600) {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.category-item > div::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: rgba(255, 221, 0, 0.1);
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: -1;
}

.category-item > div:hover::before {
  width: 100%;
}

/* Mantendo apenas o efeito de hover sem alterar o posicionamento */

/* Efeito de destaque para o item selecionado */
.category-item > div.bg-empire-yellow {
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.category-item > div.bg-amber-600::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(237, 137, 54, 0.2), rgba(237, 137, 54, 0.4));
  z-index: -1;
}

/* Estilo para os ícones de expansão */
.category-item svg {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.category-item:hover svg {
  transform: scale(1.3);
}

/* Animação para os submenus - mantendo a visibilidade original */
.category-item > div + div {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Mantendo os efeitos visuais sem afetar o posicionamento */

/* Estilo para o menu mobile */
.md\:hidden.category-dropdown button {
  background: transparent;
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.md\:hidden.category-dropdown button:hover,
.md\:hidden.category-dropdown button:focus,
.md\:hidden.category-dropdown button:active {
  background: rgba(255, 221, 0, 0.1);
}

/* Animação para o dropdown mobile */
.md\:hidden.category-dropdown > div {
  transform-origin: top center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
</style>
