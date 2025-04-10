<template>
  <div class="category-tree-item">
    <div
      class="category-header"
      :class="{ 'selected-category': selectedCategory === category.id }"
      @click="selectCategory(category.id)"
    >
      <div class="flex items-center gap-3">
        <!-- Ícone de expansão (apenas se tiver filhos) -->
        <svg
          v-if="hasChildren"
          class="w-6 h-6 transition-transform duration-300 cursor-pointer"
          :class="{ 'rotate-[-90deg]': !isExpanded, 'rotate-0': isExpanded }"
          viewBox="0 0 24 24"
          :fill="selectedCategory === category.id ? '#FBBD1E' : '#000000'"
          @click.stop="toggleExpand"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>

        <!-- Espaçador para categorias sem filhos (para manter o alinhamento) -->
        <div v-else class="w-6"></div>

        <!-- Nome da categoria (limitado a 20 caracteres) -->
        <span
          class="font-archivo text-[16px] leading-[18px]"
          :class="selectedCategory === category.id ? 'text-[#FBBD1E]' : 'text-black/70'"
          :title="category.name"
        >
          {{ category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name }}
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
  emits: ['select'],
  data() {
    return {
      isExpanded: this.category?.expanded || false
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
      console.log(`[CategoryTreeItem] Selecionando categoria: ${categoryId}, nome: ${this.category.name}`)
      console.log(`[CategoryTreeItem] Categoria tem filhos: ${this.hasChildren}, quantidade de filhos: ${this.category.children?.length || 0}`)

      // Emitir evento de seleção com o ID da categoria
      this.$emit('select', categoryId)
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
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.category-header:hover {
  background-color: rgba(251, 189, 30, 0.05);
  border-left: 3px solid #FBBD1E;
  transform: translateX(2px);
}

.selected-category {
  background-color: rgba(251, 189, 30, 0.15);
  border-left: 3px solid #FBBD1E;
  box-shadow: 0 2px 4px rgba(251, 189, 30, 0.2);
}

.subcategories {
  margin-left: 0.5rem;
  padding-left: 1rem;
  border-left: 1px dashed rgba(251, 189, 30, 0.5);
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

/* Animação para o ícone de expansão */
.w-6.h-6 {
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
</style>
