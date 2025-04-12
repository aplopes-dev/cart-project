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
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.category-item {
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
</style>
