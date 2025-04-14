<template>
  <div class="category-tree">
    <div
      v-for="category in categories"
      :key="category.id"
      class="category-item"
    >
      <CategoryTreeItem
        :category="category"
        :selected-category="selectedCategory"
        @select="$emit('select', $event)"
        @ensure-visible="handleEnsureVisible"
      />
    </div>
  </div>
</template>

<script>
import CategoryTreeItem from './CategoryTreeItem.vue'

export default {
  name: 'CategoryTree',
  components: {
    CategoryTreeItem
  },
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: String,
      default: null
    }
  },
  emits: ['select'],
  methods: {
    handleEnsureVisible(categoryId) {
      // Propaga o evento para o componente pai
      this.$emit('ensure-visible', categoryId);
    }
  }
}
</script>

<style scoped>
.category-tree {
  width: 100%;
  padding: 0.5rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #eeeeee;
  margin-top: -0.25rem; /* Adiciona margem negativa para aproximar do título */
}

/* Estilização da barra de rolagem */
.category-tree::-webkit-scrollbar {
  width: 8px;
}

.category-tree::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #eeeeee;
}

.category-tree::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #FBBD1E, #e0a800);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.5);
}

.category-tree::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #e0a800, #d09700);
  box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.7);
}

.category-item {
  margin-bottom: 6px;
  transition: all 0.3s ease;
}
</style>
