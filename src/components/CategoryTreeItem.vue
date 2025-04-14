<template>
  <div class="space-y-4">
    <div
      class="bg-[#FAFAFA] p-6 rounded-lg relative"
      :class="{
        'opacity-70': !category.isActive,
        'border border-dashed border-gray-300 bg-gray-50': !hasProducts,
        'ml-0': level === 0,
        'ml-6': level === 1,
        'ml-12': level === 2,
        'ml-18': level >= 3
      }"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <!-- Ícone de expansão para categorias com filhos -->
          <div v-if="category.children && category.children.length > 0"
               class="w-6 h-6 flex items-center justify-center cursor-pointer"
               @click="toggleExpanded">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!category.expanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-else class="w-6"></div>

          <!-- Debug: Mostrar informações da categoria -->
          <!-- <div class="text-xs text-gray-500 ml-2">
            ({{ category.children ? category.children.length : 0 }} filhos, expanded: {{ category.expanded ? 'sim' : 'não' }})
          </div> -->

          <div class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-archivo-narrow font-semibold text-lg flex items-center">
              {{ category.name }}
              <span v-if="!hasProducts" class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {{ $t('systemSettings.noProductsInCategory') }}
              </span>
            </h3>
            <p class="text-black/70 font-archivo text-sm truncate max-w-md">
              {{ category.description || $t('systemSettings.noDescription') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-archivo">{{ category.isActive ? $t('systemSettings.enabled') : $t('systemSettings.disabled') }}</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="category.isActive"
                class="sr-only peer"
                @change="toggleStatus"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-empire-yellow"></div>
            </label>
          </div>

          <button
            @click="showProducts"
            class="px-3 py-1 border border-black/25 rounded text-sm font-archivo hover:bg-black/5"
            :class="{ 'opacity-50 cursor-not-allowed': !hasProducts }"
            :disabled="!hasProducts"
          >
            {{ expandedCategoryId === category.id ? $t('systemSettings.hideProducts') : $t('systemSettings.showProducts') }}
          </button>
        </div>
      </div>

      <!-- Lista de Produtos da Categoria -->
      <div v-if="expandedCategoryId === category.id" class="mt-6 border-t border-black/10 pt-4">
        <slot name="products" :category="category"></slot>
      </div>
    </div>

    <!-- Categorias filhas (recursivo) -->
    <div v-if="category.expanded && category.children && category.children.length > 0" class="ml-6 space-y-4">
      <!-- Debug: Mostrar informações da categoria expandida -->
      <!-- <div class="bg-gray-100 p-2 mb-2 text-xs">
        Categoria {{ category.name }} expandida: {{ category.expanded }}
        Filhos: {{ category.children.length }}
      </div> -->
      <category-tree-item
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :level="level + 1"
        :expanded-category-id="expandedCategoryId"
        @toggle-status="$emit('toggle-status', $event)"
        @show-products="$emit('show-products', $event)"
        @toggle-expanded="$emit('toggle-expanded', $event)"
      >
        <template #products="slotProps">
          <slot name="products" :category="slotProps.category"></slot>
        </template>
      </category-tree-item>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CategoryTreeItem',
  props: {
    category: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    expandedCategoryId: {
      type: [String, Number, null],
      default: null
    }
  },
  emits: ['toggle-status', 'show-products', 'toggle-expanded'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const toggleStatus = () => {
      emit('toggle-status', props.category)
    }

    const showProducts = () => {
      emit('show-products', props.category)
    }

    const toggleExpanded = () => {
      // Emitir evento para expandir/colapsar a categoria
      // Isso apenas expande/colapsa as subcategorias, sem mostrar os produtos

      // Verificar se a categoria tem filhos antes de emitir o evento
      if (props.category.children && props.category.children.length > 0) {
        // Emitir o evento para expandir/colapsar a categoria
        emit('toggle-expanded', props.category)
      }
    }

    const handleImageError = (e) => {
      e.target.src = '/images/products/no-image.png'
    }

    // Verificar se a categoria tem produtos associados
    const hasProducts = () => {
      // Verificamos se a categoria tem a propriedade has_products
      if (typeof props.category.has_products !== 'undefined') {
        return props.category.has_products
      }

      // Se não tiver, verificamos se a categoria tem produtos associados
      // Isso é uma simplificação, idealmente o backend deveria fornecer esta informação
      return false // Por padrão, assumimos que não tem produtos para destacar visualmente
    }

    return {
      toggleStatus,
      showProducts,
      toggleExpanded,
      handleImageError,
      hasProducts: hasProducts(),
      t
    }
  }
}
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>
