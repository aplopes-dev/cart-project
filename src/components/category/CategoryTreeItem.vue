<template>
  <div class="category-tree-item">
    <div
      class="category-header"
      :class="{
        'selected-category': selectedCategory === category.id,
        'inactive-category': !category.isActive,
        'no-products-category': !category.has_products
      }"
      @click="selectCategory(category.id)"
    >
      <div class="flex items-center gap-2 w-full">
        <!-- Ícone de expansão (apenas se tiver filhos) -->
        <svg
          v-if="hasChildren"
          class="w-5 h-5 flex-shrink-0 transition-transform duration-300 cursor-pointer"
          :class="{ 'rotate-[-90deg]': !isExpanded, 'rotate-0': isExpanded }"
          viewBox="0 0 24 24"
          :fill="selectedCategory === category.id ? '#FBBD1E' : '#000000'"
          @click.stop="toggleExpand"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>

        <!-- Espaçador para categorias sem filhos (para manter o alinhamento) -->
        <div v-else class="w-5 flex-shrink-0"></div>

        <!-- Nome da categoria com truncamento e tooltip -->
        <div class="flex-1 overflow-hidden">
          <span
            class="font-archivo text-[15px] leading-[18px] block truncate font-medium"
            :class="selectedCategory === category.id ? 'text-[#FBBD1E] font-semibold' : 'text-gray-800'"
            :title="category.name"
          >
            {{ category.name }}
          </span>
        </div>

        <!-- Indicador de produtos -->
        <span
          v-if="category.has_products"
          class="text-xs ml-1 flex-shrink-0 font-medium"
          :class="selectedCategory === category.id ? 'text-[#FBBD1E]' : 'text-gray-600'"
        >
          ({{ getProductCount(category) }})
        </span>
      </div>
    </div>

    <!-- Subcategorias (filhos) -->
    <div
      v-if="hasChildren && isExpanded"
      class="subcategories pl-6 mt-2"
    >
      <div
        v-for="child in category.children"
        :key="child.id"
        class="category-item mb-2"
      >
        <CategoryTreeItem
          :category="child"
          :selected-category="selectedCategory"
          @select="$emit('select', $event)"
          @ensure-visible="$emit('ensure-visible', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryTreeItem',
  props: {
    category: {
      type: Object,
      required: true
    },
    selectedCategory: {
      type: String,
      default: null
    }
  },
  emits: ['select', 'ensure-visible'],
  data() {
    return {
      isExpanded: this.category?.expanded || false
    }
  },

  watch: {
    // Observa mudanças na propriedade expanded da categoria
    'category.expanded': {
      immediate: true,
      handler(newValue) {
        if (newValue === true) {
          this.isExpanded = true;
        }
      }
    },
    // Observa mudanças na categoria selecionada
    selectedCategory: {
      immediate: true,
      handler(newValue) {
        // Verifica se a categoria atual ou algum de seus descendentes está selecionado
        if (newValue) {
          this.expandIfSelected(newValue);

          // Se a categoria atual é a selecionada, emite um evento para garantir que ela esteja visível
          if (newValue === this.category.id) {
            this.$emit('ensure-visible', this.category.id);
          }
        }
      }
    }
  },
  computed: {
    hasChildren() {
      return this.category?.children && this.category.children.length > 0
    }
  },
  methods: {
    toggleExpand(event) {
      // Altera o estado de expansão local em vez da prop
      this.isExpanded = !this.isExpanded
      event.stopPropagation()
    },
    selectCategory(categoryId) {
      // Adicionar logs para debug
      console.log(`[CategoryTreeItem] Tentando selecionar categoria: ${categoryId}, nome: ${this.category.name}`)
      console.log(`[CategoryTreeItem] Categoria tem produtos: ${this.category.has_products}, isActive: ${this.category.isActive}`)

      // Temporariamente removendo a verificação de produtos para debug
      // if (this.category.has_products === false) {
      //   console.log(`[CategoryTreeItem] Categoria sem produtos: ${this.category.name}, ignorando seleção`)
      //   return
      // }

      console.log(`[CategoryTreeItem] Selecionando categoria: ${categoryId}, nome: ${this.category.name}`)
      console.log(`[CategoryTreeItem] Categoria tem filhos: ${this.hasChildren}, quantidade de filhos: ${this.category.children?.length || 0}`)

      // Emitir evento de seleção com o ID da categoria
      this.$emit('select', categoryId)
    },
    getProductCount(category) {
      // Aqui você pode implementar uma lógica para contar produtos
      // Por enquanto, retornamos um valor fixo ou um valor aleatório para demonstração
      return category.productCount || ''
    },
    // Verifica se a categoria atual ou algum de seus descendentes está selecionado
    expandIfSelected(selectedId) {
      // Se a categoria atual está selecionada, não precisa fazer nada
      if (this.category.id === selectedId) {
        return true;
      }

      // Se a categoria tem filhos, verifica se algum deles está selecionado
      if (this.hasChildren) {
        for (const child of this.category.children) {
          // Verifica se o filho está selecionado
          if (child.id === selectedId) {
            this.isExpanded = true;
            return true;
          }

          // Verifica recursivamente se algum descendente está selecionado
          const hasSelectedDescendant = this.checkDescendants(child, selectedId);
          if (hasSelectedDescendant) {
            this.isExpanded = true;
            return true;
          }
        }
      }

      return false;
    },
    // Verifica recursivamente se algum descendente está selecionado
    checkDescendants(category, selectedId) {
      // Se a categoria está selecionada, retorna true
      if (category.id === selectedId) {
        return true;
      }

      // Se a categoria tem filhos, verifica se algum deles está selecionado
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          // Verifica se o filho está selecionado
          if (child.id === selectedId) {
            return true;
          }

          // Verifica recursivamente se algum descendente está selecionado
          const hasSelectedDescendant = this.checkDescendants(child, selectedId);
          if (hasSelectedDescendant) {
            return true;
          }
        }
      }

      return false;
    }
  }
}
</script>

<style scoped>
.category-tree-item {
  margin-bottom: 0.5rem;
}

.category-header {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  max-height: 42px;
  overflow: hidden;
  background-color: #f8f8f8;
}

.category-header:hover {
  background-color: rgba(251, 189, 30, 0.1);
  border-left: 3px solid #FBBD1E;
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-category {
  background-color: rgba(251, 189, 30, 0.2);
  border-left: 3px solid #FBBD1E;
  box-shadow: 0 2px 5px rgba(251, 189, 30, 0.3);
}

/* Estilo para categorias inativas */
.inactive-category {
  opacity: 0.7;
  background-color: #eaeaea;
  border-left: 3px solid #cccccc;
}

.inactive-category:hover {
  background-color: #e5e5e5;
  border-left: 3px solid #bbbbbb;
}

/* Estilo para categorias sem produtos */
.no-products-category {
  opacity: 0.7;
  cursor: default;
  background-color: #f0f0f0;
  border-left: 3px solid #dddddd;
}

.no-products-category:hover {
  background-color: #e8e8e8;
  border-left: 3px solid #cccccc;
  transform: none;
}

.subcategories {
  margin-left: 0.25rem;
  padding-left: 0.75rem;
  border-left: 2px dashed rgba(251, 189, 30, 0.6);
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Estilização da barra de rolagem */
.subcategories::-webkit-scrollbar {
  width: 5px;
}

.subcategories::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.subcategories::-webkit-scrollbar-thumb {
  background: #FBBD1E;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.subcategories::-webkit-scrollbar-thumb:hover {
  background: #e0a800;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

/* Animação para o ícone de expansão */
.w-5.h-5 {
  transition: transform 0.3s ease;
}

/* Estilo para o texto da categoria */
.font-archivo {
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: color 0.3s ease;
}

.category-header:hover .font-archivo {
  color: #FBBD1E !important;
}

/* Estilo para o contador de produtos */
.text-xs {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>
