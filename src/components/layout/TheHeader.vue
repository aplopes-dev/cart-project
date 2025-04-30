<template>
  <header :class="[
    'w-full z-[100]',
    { 'fixed bg-black/30': isHomePage, 'relative bg-black': !isHomePage }
  ]">
    <!-- Company Banner -->
    <CompanyBanner />

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
                class="w-[140px] h-[80px] md:w-[180px] md:h-[103.28px] object-contain"
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

              <!-- Email - redireciona para página de contato -->
              <div class="relative">
                <router-link to="/contact" class="flex items-center">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                </router-link>
              </div>

              <!-- Phone - redireciona para página de contato -->
              <div class="relative">
                <router-link to="/contact" class="flex items-center">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </router-link>
              </div>

              <!-- Menu Button -->
              <button class="md:hidden flex items-center" @click="toggleMobileMenu">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Segunda linha: Projeto, Carrinho e Sign in (apenas mobile) -->
          <div class="flex md:hidden justify-end items-center gap-6 mt-0.5">
            <!-- Project Selector Mobile (visível apenas quando logado e tem projetos) -->
            <ProjectSelector
              v-if="isAuthenticated"
              :is-authenticated="isAuthenticated"
              ref="projectSelectorMobile"
              :class="{ 'mr-2': projectHasProjects }"
            />

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
                    :class="{ 'transform rotate-180': isUserMenuOpen }"
                    viewBox="0 0 24 24"
                    fill="#FFDD00"
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
        <nav class="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-5 mb-4 md:mb-0">
          <router-link to="/" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.home') }}
          </router-link>
          <router-link to="/history" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.history') }}
          </router-link>
          <router-link to="/suppliers" class="text-[15px] leading-7 text-white font-archivo font-medium">
            {{ $t('header.suppliers') }}
          </router-link>
          <div class="relative category-dropdown" style="position: relative; z-index: 100;">
            <button
              class="text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1"
              @click="toggleCategoryDropdown"
            >
              {{ $t('header.shop') }}
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': showCategoryDropdown }"
                viewBox="0 0 24 24"
                fill="#FFDD00"
                @click.stop="toggleCategoryDropdown"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Menu System - Three Parallel Menus -->
            <div class="shop-menu-container" v-if="showCategoryDropdown">
              <!-- First Level Menu (Categories) -->
              <div class="menu-level bg-black py-1 z-50 max-h-[500px] overflow-y-auto border-0 border-none" style="width: 250px; background-color: #000000;">
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

                <!-- Categories List -->
                <template v-else>
                  <div
                    v-for="category in categories"
                    :key="category.id"
                    class="category-item"
                    @mouseenter="setActiveCategory(category)"
                  >
                    <div
                      :class="[
                        'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide whitespace-nowrap overflow-hidden truncate',
                        activeCategory && activeCategory.id === category.id ? 'bg-empire-yellow text-black' : 'text-white hover:bg-empire-yellow hover:text-black'
                      ]"
                      :title="category.name"
                      @click.stop="navigateToCategory(category.id)"
                    >
                      <!-- Category Name -->
                      {{ $filters.formatCategoryName(category.name).length > 20 ? $filters.formatCategoryName(category.name).substring(0, 20) + '...' : $filters.formatCategoryName(category.name) }}

                      <!-- Arrow Icon (only if has children) -->
                      <div
                        v-if="category.children && category.children.length > 0"
                        class="flex items-center justify-center w-6 h-6"
                      >
                        <svg
                          class="w-4 h-4 category-arrow"
                          viewBox="0 0 24 24"
                          :fill="activeCategory && activeCategory.id === category.id ? '#000000' : '#FBBD1E'"
                          style="transform: rotate(-90deg);"
                        >
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Second Level Menu (Subcategories) -->
              <div
                v-if="activeCategory && activeCategory.children && activeCategory.children.length > 0"
                class="menu-level bg-empire-yellow py-0 z-50 max-h-[500px] overflow-y-auto border-0 border-none outline-none rounded-none w-full"
                style="width: 250px; background-color: #FFDD00;"

              >
                <div
                  v-for="subcategory in activeCategory.children"
                  :key="subcategory.id"
                  class="subcategory-item"
                  @mouseenter="setActiveSubcategory(subcategory)"
                >
                  <div
                    :class="[
                      'flex items-center justify-between px-4 py-2 cursor-pointer group font-medium border-0 border-none outline-none whitespace-nowrap overflow-hidden truncate no-transition',
                      activeSubcategory && activeSubcategory.id === subcategory.id ? 'bg-black text-empire-yellow hover-style' : 'bg-empire-yellow text-black hover:bg-black hover:text-empire-yellow'
                    ]"
                    :title="subcategory.name"
                    @click.stop="navigateToCategory(subcategory.id)"
                  >
                    <!-- Subcategory Name -->
                    {{ $filters.formatCategoryName(subcategory.name).length > 18 ? $filters.formatCategoryName(subcategory.name).substring(0, 18) + '...' : $filters.formatCategoryName(subcategory.name) }}

                    <!-- Arrow Icon (only if has children) -->
                    <svg
                      v-if="subcategory.children && subcategory.children.length > 0"
                      class="w-4 h-4 subcategory-arrow"
                      viewBox="0 0 24 24"
                      :fill="activeSubcategory && activeSubcategory.id === subcategory.id ? '#FFDD00' : '#000000'"
                      style="transform: rotate(-90deg);"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Third Level Menu -->
              <div
                v-if="activeSubcategory && activeSubcategory.children && activeSubcategory.children.length > 0"
                class="menu-level bg-empire-yellow py-0 z-50 max-h-[500px] overflow-y-auto border-0 border-none outline-none rounded-none w-full"
                style="width: 250px; background-color: #FFDD00;"

              >
                <div
                  v-for="thirdLevel in activeSubcategory.children"
                  :key="thirdLevel.id"
                  class="third-level-item"
                  @click.stop="navigateToCategory(thirdLevel.id)"
                  :title="thirdLevel.name"
                >
                  {{ $filters.formatCategoryName(thirdLevel.name).length > 18 ? $filters.formatCategoryName(thirdLevel.name).substring(0, 18) + '...' : $filters.formatCategoryName(thirdLevel.name) }}
                </div>
              </div>
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
        <div class="flex flex-wrap justify-center items-center gap-3 md:gap-1">
          <!-- Language Desktop (ícones + texto) -->
          <div class="relative hidden md:block mr-0">
            <button
              @click="toggleLanguageDropdown"
              class="language-selector flex items-center gap-1 text-[15px] leading-7 text-white font-archivo font-medium bg-transparent cursor-pointer pl-1 pr-2"
            >
              <img
                :src="flagImages[selectedLanguage]"
                class="w-4 h-4"
                :alt="`${selectedLanguage} flag`"
              />
              {{ selectedLanguage }}
              <svg
                class="w-3 h-3"
                :class="{ 'transform rotate-180': isLanguageDropdownOpen }"
                viewBox="0 0 24 24"
                fill="#FFDD00"
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

          <!-- Project Selector (visible only when logged in and has projects) -->
          <ProjectSelector
            :is-authenticated="isAuthenticated"
            ref="projectSelector"
            :class="{ 'mr-2 md:mr-1': projectHasProjects }"
          />

          <!-- Cart and Sign In -->
          <div class="flex items-center gap-4 md:gap-3">
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
                    :class="{ 'transform rotate-180': isUserMenuOpen }"
                    viewBox="0 0 24 24"
                    fill="#FFDD00"
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



          <!-- Search - Desktop -->
          <div class="relative hidden md:block search-container">
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
              class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl mt-2 max-h-[400px] overflow-y-auto z-50 border border-gray-200 search-results"
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
                <div class="text-sm">{{ $t('header.noProductsFound') }}</div>
                <div class="text-xs mt-1 text-gray-500">{{ $t('header.tryAnotherSearch') }}</div>
              </div>
            </div>
          </div>

          <!-- Search - Mobile -->
          <div class="md:hidden w-full px-4 mb-4 search-container">
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
              class="absolute left-4 right-4 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-50 max-h-[60vh] overflow-y-auto border border-gray-200 search-results"
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
                <div class="text-sm">{{ $t('header.noProductsFound') }}</div>
                <div class="text-xs mt-1 text-gray-500">{{ $t('header.tryAnotherSearch') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden w-full">
        <!-- Navigation Links Mobile -->
        <nav class="grid grid-cols-4 gap-1 w-full py-2 border-t border-[rgba(78,78,78,0.35)]">
          <router-link to="/" class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center">
            {{ $t('header.home') }}
          </router-link>
          <router-link to="/history" class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center">
            {{ $t('header.history') }}
          </router-link>
          <!-- Menu Loja mobile -->
          <div class="md:hidden category-dropdown relative">
            <button
              @click="toggleCategoryDropdown"
              class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center w-full flex items-center justify-center gap-1"
            >
              {{ $t('header.shop') }}
              <svg
                class="w-3 h-3 transition-transform duration-200"
                :class="{ 'transform rotate-180': showCategoryDropdown }"
                viewBox="0 0 24 24"
                fill="#FFDD00"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <!-- Dropdown do menu Loja -->
            <div
              v-if="showCategoryDropdown"
              class="absolute bg-black shadow-lg z-50 rounded-lg mt-12 left-1/2 transform -translate-x-1/2 mobile-shop-menu"
              style="width: 220px;"
            >
              <div class="max-h-[40vh] overflow-y-auto py-1 scrollbar-hide" ref="categoryScrollContainer">
                <!-- Primeiro nível de categorias -->
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="relative category-item"
                >
                  <div
                    :class="['flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors duration-200 group font-medium tracking-wide mobile-category-item text-xs', category.expanded ? 'expanded' : '']"
                    :style="{
                      'background-color': category.expanded ? '#FFDD00 !important' : 'black !important',
                      'color': category.expanded ? 'black !important' : 'white !important',
                      'display': 'flex',
                      'align-items': 'center',
                      'justify-content': 'space-between',
                      'gap': '6px'
                    }"
                    @click="setActiveCategory(category)"
                  >
                    <!-- Nome da categoria -->
                    <span
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; display: block;"
                      :style="{'color': category.expanded ? 'black !important' : 'white !important'}"
                      :title="category.name"
                      class="text-xs"
                    >{{ $filters.formatCategoryName(category.name) }}</span>

                    <!-- Ícone de seta se tiver filhos (gira quando expandido) -->
                    <svg
                      v-if="category.children && category.children.length > 0"
                      class="transition-transform duration-200 mobile-arrow w-3 h-3 flex-shrink-0"
                      :class="{'transform rotate-180': category.expanded}"
                      viewBox="0 0 24 24"
                      :fill="category.expanded ? '#000000' : '#FFDD00'"
                      :style="{'fill': category.expanded ? '#000000 !important' : '#FFDD00 !important'}"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>

                  <!-- Segundo nível de categorias (expandido verticalmente) -->
                  <div v-if="category.expanded && category.children && category.children.length > 0" class="py-0" style="background-color: #FFDD00 !important;">
                    <div
                      v-for="subcategory in category.children"
                      :key="subcategory.id"
                      :class="['relative subcategory-item', subcategory.expanded ? 'expanded' : '']"
                    >
                      <div
                        :class="['flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors duration-200 group font-medium tracking-wide mobile-subcategory-item text-xs', subcategory.expanded ? 'expanded' : '']"
                        :style="{
                          'background-color': subcategory.expanded ? 'black !important' : '#FFDD00 !important',
                          'color': subcategory.expanded ? '#FFDD00 !important' : 'black !important',
                          'display': 'flex',
                          'align-items': 'center',
                          'justify-content': 'space-between',
                          'gap': '6px'
                        }"
                        @click="setActiveSubcategory(subcategory)"
                      >
                        <!-- Nome da subcategoria -->
                        <span
                          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; display: block;"
                          :style="{'color': subcategory.expanded ? '#FFDD00 !important' : 'black !important'}"
                          :title="subcategory.name"
                          class="text-xs"
                        >{{ $filters.formatCategoryName(subcategory.name) }}</span>

                        <!-- Ícone de seta se tiver filhos (gira quando expandido) -->
                        <svg
                          v-if="subcategory.children && subcategory.children.length > 0"
                          class="transition-transform duration-200 mobile-arrow w-3 h-3 flex-shrink-0"
                          :class="{'transform rotate-180': subcategory.expanded}"
                          viewBox="0 0 24 24"
                          :fill="subcategory.expanded ? '#FFDD00' : '#000000'"
                        >
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                        </svg>
                      </div>

                      <!-- Terceiro nível de categorias (expandido verticalmente) -->
                      <div v-if="subcategory.expanded && subcategory.children && subcategory.children.length > 0" class="py-0 third-level-container" style="background-color: black !important;">
                        <div
                          v-for="childCategory in subcategory.children"
                          :key="childCategory.id"
                          class="px-4 py-1.5 cursor-pointer transition-colors duration-200 group font-medium tracking-wide mobile-childcategory-item text-xs"
                          style="background-color: black !important; color: #FFDD00 !important; display: flex; align-items: center;"
                          @click="navigateToCategory(childCategory.id)"
                        >
                          <span
                            style="color: #FFDD00 !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; display: block;"
                            :title="childCategory.name"
                            class="text-xs"
                          >{{ $filters.formatCategoryName(childCategory.name) }}</span>
                        </div>
                      </div>

                      <!-- Link para a subcategoria se não tiver filhos ou se não estiver expandida -->
                      <div
                        v-if="!subcategory.children || subcategory.children.length === 0"
                        class="absolute inset-0 z-10 subcategory-link"
                        style="background-color: transparent !important;"
                        @click.stop="navigateToCategory(subcategory.id)"
                      ></div>
                    </div>
                  </div>

                  <!-- Link para a categoria se não tiver filhos ou se não estiver expandida -->
                  <div
                    v-if="!category.children || category.children.length === 0"
                    class="absolute inset-0 z-10"
                    @click.stop="navigateToCategory(category.id)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/suppliers" class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center">
            {{ $t('header.suppliers') }}
          </router-link>
          <router-link to="/career" class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center">
            {{ $t('header.career') }}
          </router-link>
          <router-link to="/contact" class="px-1 py-1 text-[13px] leading-5 text-white font-archivo font-medium text-center">
            {{ $t('header.contactUs') }}
          </router-link>

          <!-- Mobile Search Button -->
          <div class="md:hidden col-span-4 mx-4 mt-2 search-container">
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
              class="absolute left-0 right-0 mt-2 mx-4 bg-white rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto search-results"
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
                  @error="handleImageError"
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
import ProjectSelector from '../project/ProjectSelector.vue'
import CompanyBanner from '../company/CompanyBanner.vue'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { logoService } from '@/services/logoService'
import { imageService } from '@/services/imageService'
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

// Computed para verificar se o seletor de projetos tem projetos
const projectHasProjects = computed(() => {
  return (projectSelector.value?.hasProjects || projectSelectorMobile.value?.hasProjects || false)
})

// Refs para os componentes ProjectSelector
const projectSelector = ref(null)
const projectSelectorMobile = ref(null)

// Ref para o container de scroll das categorias
const categoryScrollContainer = ref(null)

// Armazenar as posições originais das categorias e subcategorias
const originalCategoryPositions = ref({})
const originalSubcategoryPositions = ref({})

// Variável para armazenar se estamos na versão mobile
const isMobile = ref(window.innerWidth < 768)

// Variável para armazenar a posição de scroll antes de expandir/contrair
const lastScrollPosition = ref(0)

// Estado
const isMobileMenuOpen = ref(false)
const isLanguageDropdownOpen = ref(false)
const isUserMenuOpen = ref(false)
// Verifica se o idioma salvo é PT e, se for, muda para FR (temporariamente)
const savedLanguage = localStorage.getItem('selectedLanguage')
const selectedLanguage = ref(
  savedLanguage === 'PT' ? 'FR' : (savedLanguage || 'FR')
)
const searchQuery = ref('')
const filteredProducts = ref([])
const showAutocomplete = ref(false)
const showCategoryDropdown = ref(false)
const logoUrl = ref('/images/logo/logo.png')
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const isSearching = ref(false)
const selectedIndex = ref(-1)
const activeCategory = ref(null) // Categoria ativa no menu
const activeSubcategory = ref(null) // Subcategoria ativa no menu

// Adicione esta ref para os dados da empresa
const companyData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})



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

// Função para carregar a logo ativa
const loadActiveLogo = async () => {
  try {
    const logo = await logoService.getActiveLogo()
    if (logo && logo.image_url) {
      logoUrl.value = logo.image_url
      console.log('[Header] Active logo loaded:', logo.name)
    }
  } catch (error) {
    console.error('Error loading active logo:', error)
    // Mantém a logo padrão em caso de erro
  }
}

// Constantes
const flagImages = {
  'EN': '/images/flags/US.svg',
  'FR': '/images/flags/FR.svg',
  'PT': '/images/flags/BR.svg'
}

// Temporariamente removido PT do array de idiomas disponíveis
// Quando quiser reativar, basta adicionar 'PT' de volta ao array
const availableLanguages = ['FR', 'EN']

// Computed Properties
const isHomePage = computed(() => route.path === '/')

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleImageError = (e) => {
  console.error('Error loading image:', e)
  // Usa a função utilitária do imageService para lidar com erros de imagem
  imageService.handleImageError(e)
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
    // Emite um evento para fechar outros dropdowns
    eventBus.emit('dropdown-opened', 'category')

    // Fecha o dropdown de projetos diretamente
    if (projectSelector.value && typeof projectSelector.value.closeDropdown === 'function') {
      projectSelector.value.closeDropdown()
    }
    if (projectSelectorMobile.value && typeof projectSelectorMobile.value.closeDropdown === 'function') {
      projectSelectorMobile.value.closeDropdown()
    }

    // Verifica se é versão mobile
    if (isMobile.value) {
      // Garante que todos os itens estejam contraídos ao abrir o menu pela primeira vez
      categories.value.forEach(category => {
        // Redefine o estado de expansão para falso
        category.expanded = false

        // Se a categoria tiver filhos, também redefine o estado de expansão deles
        if (category.children && category.children.length > 0) {
          category.children.forEach(subcategory => {
            subcategory.expanded = false
          })
        }
      })

      // Limpa as categorias ativas
      activeCategory.value = null
      activeSubcategory.value = null

      console.log('Todos os itens do menu de Loja foram contraídos (mobile)')
    }
  } else {
    // Quando fechar o dropdown, limpa as posições originais armazenadas
    originalCategoryPositions.value = {}
    originalSubcategoryPositions.value = {}
    console.log('Posições originais das categorias e subcategorias resetadas')
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

  // Remove os dados do carrinho do localStorage
  localStorage.removeItem(`cart_${userId}`);
  localStorage.removeItem('user');

  // Remove o projeto selecionado do sessionStorage
  sessionStorage.removeItem('selectedProject');
  console.log('Projeto removido do sessionStorage durante logout');

  // Emite um evento para notificar outros componentes
  eventBus.emit('selected-project-changed', null);
  console.log('Evento selected-project-changed emitido com null');

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
    // Emite um evento para fechar outros dropdowns
    eventBus.emit('dropdown-opened', 'user')

    // Fecha o dropdown de projetos diretamente
    if (projectSelector.value && typeof projectSelector.value.closeDropdown === 'function') {
      projectSelector.value.closeDropdown()
    }
    if (projectSelectorMobile.value && typeof projectSelectorMobile.value.closeDropdown === 'function') {
      projectSelectorMobile.value.closeDropdown()
    }
  }
}

// Função para buscar categorias
const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null
    // Buscar categorias diretamente do backend com estrutura hierárquica
    // e apenas categorias ativas com produtos
    const hierarchicalCategories = await categoryService.searchCategories('', true)

    // Usar as categorias hierárquicas diretamente
    categories.value = hierarchicalCategories

    console.log(`[Header] Árvore de categorias com ${categories.value.length} categorias raiz`)
  } catch (err) {
    console.error('Error fetching categories:', err)
    error.value = 'Error loading categories'
    categories.value = []
  } finally {
    loading.value = false
  }
}

// Nota: A inicialização do estado de expansão das categorias agora é feita pelo backend

// Função para definir a categoria ativa
const setActiveCategory = (category) => {
  // Salva a posição atual de scroll antes de qualquer modificação
  if (categoryScrollContainer.value) {
    lastScrollPosition.value = categoryScrollContainer.value.scrollTop
    console.log(`Posição de scroll salva: ${lastScrollPosition.value}px`)
  }

  // Verifica se a categoria já está ativa
  const isAlreadyActive = activeCategory.value && activeCategory.value.id === category.id

  // Se a categoria já está ativa, alterna o estado de expansão
  if (isAlreadyActive && category.children && category.children.length > 0) {
    category.expanded = !category.expanded

    // Se estiver retraindo, restaura a categoria para sua posição original (apenas em desktop)
    if (!category.expanded) {
      // Mantém a categoria ativa
      activeCategory.value = category

      // Não precisamos mais restaurar a posição original, pois não movemos os itens
      console.log(`Categoria ${category.name} contraída (sem reordenar)`)
    }

    return
  }

  // Define a categoria ativa
  activeCategory.value = category
  activeSubcategory.value = null

  // Adiciona a classe expanded à categoria ativa
  if (category && category.children && category.children.length > 0) {
    // Marca a categoria como expandida
    category.expanded = true

    // Remove a classe expanded de todas as outras categorias
    categories.value.forEach(cat => {
      if (cat.id !== category.id) {
        cat.expanded = false
      }
    })

    // Na versão mobile, não reordenamos mais as categorias ao expandir
    // e restauramos a posição de scroll para manter exatamente onde foi clicado
    if (isMobile.value) {
      const index = categories.value.findIndex(cat => cat.id === category.id)
      console.log(`Categoria ${category.name} expandida na posição ${index} (sem reordenar)`)

      // Restaura a posição de scroll após o Vue atualizar o DOM
      setTimeout(() => {
        if (categoryScrollContainer.value) {
          categoryScrollContainer.value.scrollTop = lastScrollPosition.value
          console.log(`Posição de scroll restaurada para ${lastScrollPosition.value}px após expandir/contrair`)
        }
      }, 50)
    } else {
      // Em desktop, não movemos mais os itens para o topo
      const index = categories.value.findIndex(cat => cat.id === category.id)
      if (index > 0) {
        // Apenas armazenamos a posição original para referência
        originalCategoryPositions.value[category.id] = index
        console.log(`Posição original da categoria ${category.name} salva: ${index}`)
      }
    }
  }
}

// Função para definir a subcategoria ativa
const setActiveSubcategory = (subcategory) => {
  // Salva a posição atual de scroll antes de qualquer modificação
  if (categoryScrollContainer.value) {
    lastScrollPosition.value = categoryScrollContainer.value.scrollTop
    console.log(`Posição de scroll salva (subcategoria): ${lastScrollPosition.value}px`)
  }

  // Verifica se a subcategoria já está ativa
  const isAlreadyActive = activeSubcategory.value && activeSubcategory.value.id === subcategory.id

  // Se a subcategoria já está ativa, alterna o estado de expansão
  if (isAlreadyActive && subcategory.children && subcategory.children.length > 0) {
    subcategory.expanded = !subcategory.expanded

    // Se estiver retraindo, restaura a subcategoria para sua posição original (apenas em desktop)
    if (!subcategory.expanded) {
      // Mantém a subcategoria ativa
      activeSubcategory.value = subcategory

      // Não precisamos mais restaurar a posição original, pois não movemos os itens
      console.log(`Subcategoria ${subcategory.name} contraída (sem reordenar)`)
    }

    return
  }

  // Define a subcategoria ativa
  activeSubcategory.value = subcategory

  // Adiciona a classe 'expanded-item' a todos os itens expandidos
  if (subcategory && subcategory.children && subcategory.children.length > 0) {
    // Marca o item como expandido
    subcategory.expanded = true

    // Certifica-se de que outras subcategorias do mesmo nível estão retraídas
    if (activeCategory.value && activeCategory.value.children) {
      // Na versão mobile, não reordenamos mais as subcategorias ao expandir
      // e restauramos a posição de scroll para manter exatamente onde foi clicado
      if (isMobile.value) {
        const index = activeCategory.value.children.findIndex(sub => sub.id === subcategory.id)
        console.log(`Subcategoria ${subcategory.name} expandida na posição ${index} (sem reordenar)`)

        // Restaura a posição de scroll após o Vue atualizar o DOM
        setTimeout(() => {
          if (categoryScrollContainer.value) {
            categoryScrollContainer.value.scrollTop = lastScrollPosition.value
            console.log(`Posição de scroll restaurada para ${lastScrollPosition.value}px após expandir/contrair subcategoria`)
          }
        }, 50)
      } else {
        // Em desktop, não movemos mais os itens para o topo
        const index = activeCategory.value.children.findIndex(sub => sub.id === subcategory.id)
        if (index > 0) {
          // Apenas armazenamos a posição original para referência
          originalSubcategoryPositions.value[subcategory.id] = index
          console.log(`Posição original da subcategoria ${subcategory.name} salva: ${index}`)
        }
      }

      // Depois retraí todas as outras subcategorias
      activeCategory.value.children.forEach(sibling => {
        if (sibling.id !== subcategory.id) {
          sibling.expanded = false
        }
      })
    }
  }
}

// Funções para o seletor de idiomas
const toggleLanguageDropdown = (event) => {
  event.stopPropagation()
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
  // Fecha outros dropdowns quando abrir este
  if (isLanguageDropdownOpen.value) {
    isUserMenuOpen.value = false
    showCategoryDropdown.value = false
    // Emite um evento para fechar outros dropdowns
    eventBus.emit('dropdown-opened', 'language')

    // Fecha o dropdown de projetos diretamente
    if (projectSelector.value && typeof projectSelector.value.closeDropdown === 'function') {
      projectSelector.value.closeDropdown()
    }
    if (projectSelectorMobile.value && typeof projectSelectorMobile.value.closeDropdown === 'function') {
      projectSelectorMobile.value.closeDropdown()
    }
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
  const projectDropdown = event.target.closest('.project-dropdown')
  const searchContainer = event.target.closest('.search-container')
  const searchResults = event.target.closest('.search-results')

  // Fecha os dropdowns de idioma e usuário
  if (!languageSelector && !userMenu) {
    isLanguageDropdownOpen.value = false
    isUserMenuOpen.value = false
  }

  // Fecha o menu de categorias apenas quando clicar fora dele
  if (!categoryDropdown) {
    if (showCategoryDropdown.value) {
      showCategoryDropdown.value = false
      // Limpa as posições originais quando o dropdown é fechado por clique fora
      originalCategoryPositions.value = {}
      originalSubcategoryPositions.value = {}
      console.log('Posições originais resetadas por clique fora do dropdown')
    }
  }

  // Fecha o dropdown de projetos no componente ProjectSelector
  if (!projectDropdown && projectSelector.value) {
    // Acessa o método do componente ProjectSelector para fechar o dropdown
    if (typeof projectSelector.value.closeDropdown === 'function') {
      projectSelector.value.closeDropdown()
    }
  }

  // Fecha o autocomplete de busca e limpa o campo quando clicar fora
  if (!searchContainer && !searchResults && showAutocomplete.value) {
    closeSearch()
    console.log('Campo de busca limpo e autocomplete fechado por clique fora')
  }
}

// Função para atualizar o estado mobile
const updateMobileState = () => {
  isMobile.value = window.innerWidth < 768
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Adiciona listener para redimensionamento da janela
  window.addEventListener('resize', updateMobileState)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)

  // Remove listener de redimensionamento
  window.removeEventListener('resize', updateMobileState)
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

    // Limpa as posições originais quando o menu mobile é fechado
    originalCategoryPositions.value = {}
    originalSubcategoryPositions.value = {}
    console.log('Posições originais resetadas ao fechar menu mobile')
  }
})

// Watch para monitorar a autenticação e atualizar o projeto selecionado
watch(
  () => localStorage.getItem('token'),
  (newValue) => {
    // Atualiza o estado de autenticação
    updateAuthState()

    // Se o usuário acabou de fazer login (token existe)
    if (newValue) {
      console.log('Usuário fez login, verificando projeto no sessionStorage')

      // Aguarda um momento para garantir que os componentes estejam montados
      setTimeout(() => {
        // Verifica se o projeto está selecionado no sessionStorage
        if (projectSelector.value && typeof projectSelector.value.checkSessionStorageProject === 'function') {
          console.log('Verificando projeto no sessionStorage após login (desktop)')
          projectSelector.value.checkSessionStorageProject()
        }

        if (projectSelectorMobile.value && typeof projectSelectorMobile.value.checkSessionStorageProject === 'function') {
          console.log('Verificando projeto no sessionStorage após login (mobile)')
          projectSelectorMobile.value.checkSessionStorageProject()
        }
      }, 1000) // Aguarda 1 segundo para garantir que tudo esteja carregado
    }
  },
  { immediate: true }
)

// Watch para mudanças no estado de autenticação do store
watch(
  () => store.state.isAuthenticated,
  (newValue) => {
    // Força reavaliação do estado de autenticação
    updateAuthState()

    // Verifica o projeto selecionado quando o status de autenticação muda
    if (newValue) {
      console.log('Estado de autenticação do store mudou para autenticado')
      setTimeout(() => {
        if (projectSelector.value && typeof projectSelector.value.checkSessionStorageProject === 'function') {
          console.log('Verificando projeto no sessionStorage após mudança de autenticação (desktop)')
          projectSelector.value.checkSessionStorageProject()
        }

        if (projectSelectorMobile.value && typeof projectSelectorMobile.value.checkSessionStorageProject === 'function') {
          console.log('Verificando projeto no sessionStorage após mudança de autenticação (mobile)')
          projectSelectorMobile.value.checkSessionStorageProject()
        }
      }, 1000)
    }
  }
)

// Lifecycle Hooks
onMounted(async () => {
  // Carregar configurações financeiras
  await loadFinancialSettings()

  // Carregar logo ativa
  await loadActiveLogo()

  // Carregar categorias
  await fetchCategories()

  const handleClickOutside = (event) => {
    const languageButton = event.target.closest('.language-selector')
    const userButton = event.target.closest('.user-menu')
    const categoryButton = event.target.closest('.category-dropdown')

    if (!languageButton && !userButton) {
      isLanguageDropdownOpen.value = false
      isUserMenuOpen.value = false
    }

    // Fecha o menu de categorias apenas quando clicar fora dele
    if (!categoryButton) {
      showCategoryDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  // Adiciona um listener para o evento dropdown-opened
  eventBus.on('dropdown-opened', (source) => {
    console.log('Evento dropdown-opened recebido de:', source)
    // Se o evento vier do dropdown de projetos, fecha os outros dropdowns
    if (source === 'project') {
      isLanguageDropdownOpen.value = false
      isUserMenuOpen.value = false
      showCategoryDropdown.value = false
    }
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    eventBus.off('dropdown-opened')
  })
})

onUnmounted(() => {
  document.removeEventListener('click', (e) => {
    const target = e.target
    if (!target.closest('.language-selector')) {
      isLanguageDropdownOpen.value = false
    }
    // Fecha o menu de categorias apenas quando clicar fora dele
    if (!target.closest('.category-dropdown')) {
      showCategoryDropdown.value = false
    }
  })

  // Remove o listener do evento dropdown-opened
  eventBus.off('dropdown-opened')
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

// A função searchCategories foi removida para evitar a abertura indesejada do dropdown de categorias durante a busca

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

    // Processa as imagens dos produtos antes de atribuir ao filteredProducts
    const processedProducts = (response.items || []).map(product => {
      return {
        ...product,
        image: imageService.getProductImageUrl(product.image, product)
      };
    });

    filteredProducts.value = processedProducts
    showAutocomplete.value = true
  } catch (error) {
    console.error('Error searching products:', error)
    filteredProducts.value = []
  } finally {
    isSearching.value = false
  }
}

// Adicione o debounce para a busca de produtos
const debouncedProductSearch = debounce(searchProducts, 300)

// Adicione este watch para buscar produtos quando o termo de busca mudar
watch(searchQuery, (newValue) => {
  debouncedProductSearch(newValue)

  // Não vamos mais buscar categorias automaticamente ao digitar na busca
  // Isso evita que o menu de categorias seja aberto aleatoriamente
  if (newValue.length === 0) {
    // Se o termo de busca for limpo, recarregar todas as categorias
    fetchCategories()
  }
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
    // Buscar produtos
    debouncedProductSearch(value)

    // Garantir que o dropdown de categorias esteja fechado durante a busca
    showCategoryDropdown.value = false
  } else {
    filteredProducts.value = []
    showAutocomplete.value = false

    // Se o campo de busca for limpo, recarregar todas as categorias
    if (value.length === 0) {
      fetchCategories()
    }
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
  } else {
    // Se o autocomplete for exibido, garantir que o dropdown de categorias esteja fechado
    showCategoryDropdown.value = false
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
/* Estilo específico para o elemento expandido */
.flex.items-center.justify-between.px-4.py-2.cursor-pointer.group.font-medium.border-0.border-none.outline-none.whitespace-nowrap.overflow-hidden.truncate.no-transition.bg-black.text-empire-yellow.hover-style,
.flex.items-center.justify-between.px-4.py-2.cursor-pointer.group.font-medium.border-0.border-none.outline-none.whitespace-nowrap.overflow-hidden.truncate.no-transition.bg-black.text-empire-yellow.hover-style * {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Esconde a scrollbar mas mantém a funcionalidade */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
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

/* Estilos para garantir que os resultados da busca flutuem corretamente */
.search-results {
  position: absolute !important;
  z-index: 1000 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  max-height: 400px !important;
  overflow-y: auto !important;
  background-color: white !important;
  border-radius: 8px !important;
  width: 100% !important;
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

/* Estilos específicos para o menu mobile */
.mobile-shop-menu .subcategory-item:hover > div,
.mobile-shop-menu .subcategory-item:hover > div * {
  background-color: initial !important;
  color: initial !important;
}

.mobile-shop-menu .subcategory-item div {
  transition: all 0.3s ease;
}

/* Cores para o segundo nível não expandido */
.mobile-shop-menu .subcategory-item div:not(.bg-black) {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Cores para o segundo nível expandido */
.mobile-shop-menu .subcategory-item div.bg-black {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Garantir que as cores sejam aplicadas corretamente */
.mobile-shop-menu .bg-empire-yellow {
  background-color: #FFDD00 !important;
}

.mobile-shop-menu .text-black {
  color: black !important;
}

.mobile-shop-menu .bg-black {
  background-color: black !important;
}

.mobile-shop-menu .text-empire-yellow {
  color: #FFDD00 !important;
}

/* Sobrescrever estilos de hover */
.mobile-shop-menu .subcategory-item div:hover {
  background-color: initial !important;
  color: initial !important;
}

/* Desativar estilos de hover que estão causando problemas */
.mobile-shop-menu .category-item:hover,
.mobile-shop-menu .subcategory-item:hover,
.mobile-shop-menu .category-item:hover > div,
.mobile-shop-menu .subcategory-item:hover > div {
  background-color: initial !important;
  color: initial !important;
}

/* Garantir que as cores sejam aplicadas corretamente quando o item não está expandido */
.mobile-shop-menu .subcategory-item div.bg-empire-yellow.text-black,
.mobile-shop-menu .subcategory-item div.bg-empire-yellow,
.mobile-shop-menu .subcategory-item div:not(.bg-black) {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Aplicar cores diretamente aos elementos */
.mobile-shop-menu .subcategory-item {
  background-color: #FFDD00 !important;
}

/* Garantir que todos os itens de segundo nível tenham fundo amarelo e texto preto */
.mobile-shop-menu .subcategory-item div {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Garantir que todos os textos dentro dos itens de segundo nível sejam pretos */
.mobile-shop-menu .subcategory-item div * {
  color: black !important;
}

/* Apenas itens expandidos ou com classe bg-black têm fundo preto e texto amarelo */
.mobile-shop-menu .subcategory-item.expanded div,
.mobile-shop-menu .subcategory-item div.bg-black {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Garantir que todos os textos dentro de itens expandidos sejam amarelos */
.mobile-shop-menu .subcategory-item.expanded div *,
.mobile-shop-menu .subcategory-item div.bg-black * {
  color: #FFDD00 !important;
}

/* Estilo específico para o terceiro nível */
.mobile-shop-menu .bg-black div {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Garantir que todos os textos no terceiro nível sejam amarelos quando expandido */
.mobile-shop-menu .bg-black div * {
  color: #FFDD00 !important;
}

/* Garantir que todos os textos no terceiro nível sejam pretos quando não expandido */
.mobile-shop-menu div:not(.bg-black) div:not(.bg-black) {
  background-color: #FFDD00 !important;
  color: black !important;
}

.mobile-shop-menu div:not(.bg-black) div:not(.bg-black) * {
  color: black !important;
}

/* Garantir que as setas tenham a cor correta */
.mobile-shop-menu .subcategory-item:not(.expanded) > div svg {
  fill: black !important;
}

.mobile-shop-menu .subcategory-item.expanded > div svg {
  fill: #FFDD00 !important;
}

/* Estilos específicos para o menu mobile - Primeiro nível */
.mobile-shop-menu .category-item > div {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Primeiro nível expandido */
.mobile-shop-menu .category-item > div.bg-empire-yellow {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Estilos específicos para o menu mobile - Segundo nível */
.mobile-shop-menu .subcategory-item > div {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Segundo nível expandido */
.mobile-shop-menu .subcategory-item.expanded > div,
.mobile-shop-menu .subcategory-item > div.bg-black {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo específico para o contêiner do terceiro nível */
.mobile-shop-menu .third-level-container {
  background-color: black !important;
}

.mobile-shop-menu .third-level-container div {
  background-color: black !important;
  color: #FFDD00 !important;
}

.mobile-shop-menu .third-level-container div * {
  color: #FFDD00 !important;
}

/* Estilo específico para a classe expanded */
.mobile-shop-menu .expanded > div {
  background-color: black !important;
  color: #FFDD00 !important;
}

.mobile-shop-menu .expanded > div * {
  color: #FFDD00 !important;
}

.mobile-shop-menu .subcategory-item:not(.expanded) > div {
  background-color: #FFDD00 !important;
  color: black !important;
}

.mobile-shop-menu .subcategory-item:not(.expanded) > div * {
  color: black !important;
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

/* Estilo para os menus laterais */
.category-item {
  position: relative;
}

/* Ajuste para posicionamento dos menus laterais */
.category-dropdown > div {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
}

/* Ajuste para posicionamento dos submenus */
.category-item {
  position: relative;
}

.category-item > div {
  position: relative;
}

/* Ajustes para hover nos menus laterais */
.category-dropdown .category-item:hover > div:first-child {
  background-color: #FFDD00;
  color: black;
}

.category-dropdown .category-item:hover > div:first-child svg {
  fill: black;
}

/* Ajustes para as setas de expansão */
.category-dropdown button svg.transform.rotate-180 {
  transform: rotate(90deg) !important;
}

.category-item > div svg.transform.rotate-180 {
  transform: rotate(90deg) !important;
}

/* Estilos para o menu de loja com três níveis paralelos */
.shop-menu-container {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  display: flex;
  gap: 2px;
  z-index: 100;
}

.menu-level {
  position: relative;
  height: fit-content;
}

/* Exibir submenus ao passar o mouse */
.category-item:hover > div.absolute {
  display: block !important;
}

/* Estilo do dropdown principal */
.category-dropdown > div {
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Estilo para hover em todo o item do submenu */
.subcategory-item {
  cursor: pointer;
  border: none !important;
  border-radius: 0 !important;
}

.subcategory-item > div {
  border: none !important;
  outline: none !important;
  border-radius: 0 !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.subcategory-item:hover > div {
  background-color: black;
  color: white !important;
  border: none !important;
  outline: none !important;
  border-radius: 0 !important;
}

.subcategory-item:hover > div * {
  color: white !important;
}

/* Remover completamente todas as bordas dos menus */
.menu-level,
.shop-menu-container,
.shop-menu-container > div,
.shop-menu-container * {
  border-radius: 0 !important;
  border: none !important;
  outline: none !important;
}

/* Remover sombra dos menus */
.menu-level {
  box-shadow: none !important;
}

/* Garantir que os menus expandam no hover */
.category-item:hover,
.subcategory-item:hover {
  background-color: black !important;
}

.category-item:hover > div,
.subcategory-item:hover > div {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo para o menu principal */
.category-item:hover > div {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Estilos para os menus */
.shop-menu-container {
  display: flex;
  gap: 0;
  background-color: #FFDD00 !important;
  box-shadow: none !important;
}

/* Garantir largura fixa para todos os menus */
.shop-menu-container > div {
  width: 250px !important;
  flex-shrink: 0;
  box-shadow: none !important;
  border: none !important;
}

/* Estilo para o menu principal (preto) */
.shop-menu-container > div:first-child {
  background-color: #000000 !important;
}

/* Estilo para os submenus (amarelo) */
.shop-menu-container > div:not(:first-child) {
  background-color: #FFDD00 !important;
}

/* Garantir que todos os elementos dentro dos submenus tenham fundo amarelo */
.shop-menu-container > div:not(:first-child) > div,
.shop-menu-container > div:not(:first-child) div:not(:hover) {
  background-color: #FFDD00 !important;
}

/* Estilo para hover nos itens dos submenus */
.subcategory-item:hover > div,
.subcategory-item:hover > div *,
.subcategory-item:hover .whitespace-nowrap,
.subcategory-item:hover .truncate {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo para itens ativos nos submenus - mesmo estilo do hover */
.subcategory-item.active > div,
.subcategory-item.active > div *,
.bg-black.text-empire-yellow,
.bg-black.text-empire-yellow *,
.hover-style,
.hover-style *,
div.bg-black.text-empire-yellow.hover-style,
div.bg-black.text-empire-yellow.hover-style *,
.no-transition.bg-black.text-empire-yellow,
.no-transition.bg-black.text-empire-yellow * {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo para itens de terceiro nível e superiores */
.third-level-item:hover,
.shop-menu-container > div:nth-child(n+3) div:hover,
div[class*="bg-black text-empire-yellow hover-style"] {
  background-color: black !important;
  color: #FFDD00 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Estilo específico para o terceiro nível */
.third-level-item {
  border: none !important;
  outline: none !important;
  margin: 0 !important;
  padding: 10px 16px !important; /* Aumentamos um pouco o padding vertical */
  width: 100% !important;
  display: block !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  background-color: #FFDD00 !important;
  color: black !important;
  transition: all 0.2s ease-in-out !important;
  height: 100% !important;
  min-height: 40px !important; /* Aumentamos um pouco a altura mínima */
}

.third-level-item:hover {
  background-color: black !important;
  color: #FFDD00 !important;
  padding: 10px 16px !important;
  margin: 0 !important;
  height: 100% !important;
  min-height: 40px !important; /* Aumentamos um pouco a altura mínima */
}

.third-level-item:hover *,
.shop-menu-container > div:nth-child(n+3) div:hover *,
.third-level-item:hover .whitespace-nowrap,
.third-level-item:hover .truncate,
div[class*="bg-black text-empire-yellow hover-style"] *,
div[class*="bg-black text-empire-yellow hover-style"] .whitespace-nowrap,
div[class*="bg-black text-empire-yellow hover-style"] .truncate,
div[class*="bg-black text-empire-yellow hover-style"] .flex {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo para as setas */
.subcategory-item:hover .subcategory-arrow,
.bg-black.text-empire-yellow svg,
.hover-style svg,
.hover-style .subcategory-arrow {
  fill: #FFDD00 !important;
}

/* Estilo para a seta no hover do menu principal */
.category-hover:hover .category-arrow {
  fill: #FBBD1E !important; /* Mantemos a seta amarela no hover */
}

/* Estilo específico para a div com texto truncado */
.subcategory-item:hover .whitespace-nowrap.overflow-hidden.truncate,
.third-level-item:hover .whitespace-nowrap.overflow-hidden.truncate,
/* Estilo para o hover dos subitens (segundo e terceiro nível) */
.subcategory-item:hover div[class*="whitespace-nowrap overflow-hidden truncate"],
.third-level-item:hover div[class*="whitespace-nowrap overflow-hidden truncate"] {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo específico para o hover do primeiro nível */
.category-item > div:hover {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Classe para remover todas as transições */
.no-transition,
.no-transition * {
  transition: none !important;
}

/* Estilo específico para o item selecionado do segundo nível */
div.flex.items-center.justify-between.px-4.py-2.cursor-pointer.group.font-medium.border-0.border-none.outline-none.whitespace-nowrap.overflow-hidden.truncate.no-transition.bg-black.text-empire-yellow.hover-style {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Estilo para a seta nos níveis 2 em diante */
.subcategory-item:hover .subcategory-arrow {
  fill: #FFDD00 !important;
}

.subcategory-item:hover .subcategory-arrow path {
  fill: #FFDD00 !important;
}

/* Estilo para a seta no hover do primeiro nível */
.category-item > div:hover svg.category-arrow {
  fill: black !important;
}

.category-item > div:hover svg.category-arrow path {
  fill: black !important;
}

/* Removidos estilos personalizados para o hover do menu principal */

/* Removidos estilos personalizados para a seta */

/* Removidos estilos personalizados para a seta e o contêiner */



/* Garantir que não haja bordas na parte transparente */
.shop-menu-container::before,
.shop-menu-container::after,
.menu-level::before,
.menu-level::after {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Garantir que a seta do header gire corretamente */
.category-dropdown button svg.transform.rotate-180 {
  transform: rotate(180deg) !important;
}

/* Garantir que a seta aponte para cima quando expandido */
.category-dropdown button svg.rotate-180 {
  transform: rotate(180deg) !important;
}

/* Garantir que a seta do menu mobile aponte para cima quando expandido */
.mobile-shop-menu .mobile-category-item svg.transform.rotate-180,
.mobile-shop-menu .mobile-subcategory-item svg.transform.rotate-180 {
  transform: rotate(180deg) !important;
}

/* Garantir que todas as setas tenham o mesmo tamanho */
.mobile-arrow,
.mobile-shop-menu svg,
.mobile-category-item svg,
.mobile-subcategory-item svg {
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  flex: 0 0 20px !important;
  box-sizing: content-box !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Garantir que o primeiro e último item preencham completamente */
.subcategory-item:first-child > div {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.subcategory-item:last-child > div {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* Garantir que os itens do terceiro nível preencham completamente */
.third-level-item {
  border-radius: 0 !important;
  margin: 0 !important;
  padding: 12px 16px !important;
}

/* Garantir que o contêiner do terceiro nível não tenha padding ou margin */
.menu-level.bg-empire-yellow {
  padding: 0 !important;
  margin: 0 !important;
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
  transition: all 0s !important; /* Remover delay na transição */
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

/* Removido o efeito de transparência */

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

/* Remover o efeito de escala no hover para manter o tamanho consistente */
.mobile-shop-menu .category-item:hover svg {
  transform: none !important;
}

/* Manter apenas a rotação quando expandido */
.mobile-shop-menu .category-item svg.transform.rotate-180 {
  transform: rotate(180deg) !important;
}

.mobile-shop-menu .subcategory-item svg.transform.rotate-180 {
  transform: rotate(180deg) !important;
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

/* Garantir que o contêiner do menu mobile tenha bordas pretas */
.mobile-shop-menu {
  border: 1px solid black !important;
  border-top: none !important;
}

/* Remover bordas entre os itens do menu mobile */
.mobile-shop-menu .mobile-category-item {
  border-bottom: 1px solid black !important;
  margin-bottom: -1px !important; /* Para evitar linhas duplas */
}

/* Estilos para o menu mobile */
.mobile-category-item span {
  color: inherit !important;
}

.mobile-subcategory-item span {
  color: inherit !important;
}

.mobile-childcategory-item span {
  color: inherit !important;
}

/* Sobrescrever estilos do Tailwind */
.mobile-shop-menu .mobile-category-item {
  background-color: black !important;
  color: white !important;
  border-bottom: 1px solid black !important;
}

.mobile-shop-menu .mobile-category-item.expanded {
  background-color: #FFDD00 !important;
  color: black !important;
  border-bottom: 1px solid black !important;
}

/* Garantir que a cor da letra seja aplicada corretamente */
.mobile-shop-menu .mobile-category-item span {
  color: white !important;
}

/* Garantir que a cor da seta seja amarela quando o item não está expandido */
.mobile-shop-menu .mobile-category-item:not(.expanded) svg {
  fill: #FFDD00 !important;
  width: 20px !important;
  height: 20px !important;
}

.mobile-shop-menu .mobile-category-item.expanded span {
  color: black !important;
}

/* Garantir que a cor da seta seja preta quando o item está expandido */
.mobile-shop-menu .mobile-category-item.expanded svg {
  fill: #000000 !important;
  width: 20px !important;
  height: 20px !important;
}

.mobile-shop-menu .mobile-subcategory-item {
  background-color: #FFDD00 !important;
  color: black !important;
}

.mobile-shop-menu .mobile-subcategory-item.expanded {
  background-color: black !important;
  color: #FFDD00 !important;
}

/* Garantir que a cor da letra seja aplicada corretamente */
.mobile-shop-menu .mobile-subcategory-item span {
  color: black !important;
}

/* Garantir que as setas do segundo nível tenham o mesmo tamanho */
.mobile-shop-menu .mobile-subcategory-item svg {
  width: 20px !important;
  height: 20px !important;
}

.mobile-shop-menu .mobile-subcategory-item.expanded span {
  color: #FFDD00 !important;
}

/* Garantir que os itens de segundo nível sem filhos tenham a letra preta */
.mobile-shop-menu .subcategory-item:not(.expanded) div span {
  color: black !important;
}

/* Garantir que os itens de segundo nível sem filhos tenham o fundo amarelo e a letra preta */
.mobile-shop-menu .subcategory-item:not(.expanded) div {
  background-color: #FFDD00 !important;
  color: black !important;
}

/* Garantir que os links para subcategorias sem filhos tenham a letra preta */
.mobile-shop-menu .subcategory-item div:not(.bg-black) span,
.mobile-shop-menu .subcategory-item div span,
.mobile-shop-menu .py-0[style*="background-color: #FFDD00"] .subcategory-item div span {
  color: black !important;
}

/* Forçar a cor preta para todos os spans dentro de subcategorias */
.mobile-shop-menu .subcategory-item span {
  color: black !important;
}

/* Apenas quando expandido, a cor deve ser amarela */
.mobile-shop-menu .subcategory-item.expanded span,
.mobile-shop-menu .subcategory-item.expanded div span {
  color: #FFDD00 !important;
}

.mobile-shop-menu .mobile-childcategory-item {
  background-color: black !important;
  color: #FFDD00 !important;
}
</style>
