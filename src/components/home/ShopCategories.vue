<template>
  <section class="flex flex-col items-center py-24 px-6 gap-6 w-full bg-white">
    <div class="flex flex-col items-center gap-6 max-w-[1346px]">
      <!-- Title -->
      <h2 class="w-full text-[45px] leading-[72px] font-semibold font-archivo-narrow text-center text-black/70">
        {{ $t('categories.shopByCategories') }}
      </h2>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <!-- Category Card - Plumbing -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory(firstThreeCategories[0]?.id)">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M54 28h-2v-8c0-1.1-.9-2-2-2h-4v-2c0-1.1-.9-2-2-2h-8V6c0-1.1-.9-2-2-2H16c-1.1 0-2 .9-2 2v26H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h48c1.1 0 2-.9 2-2V30c0-1.1-.9-2-2-2zM16 8h16v8H16V8zm0 12h16v8H16v-8zm-6 38V34h44v24H10z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[24px] font-archivo-narrow font-semibold text-[#FFDD00] whitespace-nowrap overflow-hidden truncate block px-2" :title="(firstThreeCategories[0]?.name || 'PLUMBING').toUpperCase()">
                  {{ (firstThreeCategories[0]?.name || 'PLUMBING').toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="product in firstCategoryProducts" :key="product" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-lg text-black/70">{{ product }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img
                  :src="plumbingImage"
                  alt="Plumbing Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Category Card - Tools -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory(firstThreeCategories[1]?.id)">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M56 16L48 8l-8 8-6-6-4 4 6 6-20 20-6-6-4 4 6 6-8 8 8 8 8-8 6 6 4-4-6-6 20-20 6 6 4-4-6-6 8-8zm-28 28L16 32l20-20 12 12-20 20z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[24px] font-archivo-narrow font-semibold text-[#FFDD00] whitespace-nowrap overflow-hidden truncate block px-2" :title="(firstThreeCategories[1]?.name || 'TOOLS').toUpperCase()">
                  {{ (firstThreeCategories[1]?.name || 'TOOLS').toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="product in secondCategoryProducts" :key="product" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-lg text-black/70">{{ product }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img
                  :src="toolsImage"
                  alt="Tools Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Category Card - Heating -->
        <div class="flex flex-col items-start gap-6 cursor-pointer" @click="navigateToCategory(firstThreeCategories[2]?.id)">
          <div class="flex flex-row items-center w-full">
            <!-- Icon Container -->
            <div class="w-[120px] h-[120px] bg-[#FFDD00] flex justify-center items-center">
              <svg class="w-16 h-16" viewBox="0 0 64 64">
                <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 50c-12.15 0-22-9.85-22-22s9.85-22 22-22 22 9.85 22 22-9.85 22-22 22zm0-38c-8.84 0-16 7.16-16 16s7.16 16 16 16 16-7.16 16-16-7.16-16-16-16z" fill="#000"/>
              </svg>
            </div>
            <!-- Title Container -->
            <div class="flex-1 h-[80px] bg-white border border-[#FAFAFA] flex items-center min-w-[250px]">
              <div class="h-full w-full bg-black flex items-center justify-center">
                <span class="text-[24px] font-archivo-narrow font-semibold text-[#FFDD00] whitespace-nowrap overflow-hidden truncate block px-2" :title="(firstThreeCategories[2]?.name || 'HEATING').toUpperCase()">
                  {{ (firstThreeCategories[2]?.name || 'HEATING').toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <!-- Items List -->
          <div class="w-full border border-[#FAFAFA] p-6">
            <div class="flex flex-row justify-between">
              <ul class="flex flex-col gap-3">
                <li v-for="product in thirdCategoryProducts" :key="product" class="flex items-center gap-2">
                  <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5H7z" fill="#FBBD1E"/>
                  </svg>
                  <span class="text-lg text-black/70">{{ product }}</span>
                </li>
              </ul>
              <div class="w-[120px] h-[120px]">
                <img
                  :src="heatingImage"
                  alt="Heating Category"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';

const router = useRouter();
const categories = ref([]);
const categoryProducts = ref({});

const plumbingImage = '/images/categories/plumbing.png'
const toolsImage = '/images/categories/tools.png'
const heatingImage = '/images/categories/heating.png'

// Computed para pegar apenas as 3 primeiras categorias
const firstThreeCategories = computed(() => {
  return categories.value.slice(0, 3);
});

// Computed properties para os produtos de cada categoria
const firstCategoryProducts = computed(() => {
  const categoryId = firstThreeCategories.value[0]?.id;
  return categoryProducts.value[categoryId]?.slice(0, 5) || [];
});

const secondCategoryProducts = computed(() => {
  const categoryId = firstThreeCategories.value[1]?.id;
  return categoryProducts.value[categoryId]?.slice(0, 5) || [];
});

const thirdCategoryProducts = computed(() => {
  const categoryId = firstThreeCategories.value[2]?.id;
  return categoryProducts.value[categoryId]?.slice(0, 5) || [];
});

const fetchCategories = async () => {
  try {
    console.log('[ShopCategories] Iniciando carregamento de categorias');

    // Buscar todas as categorias
    const allCategories = await categoryService.getCategories();
    console.log(`[ShopCategories] Recebidas ${allCategories.length} categorias da API`);

    // Buscar contagem de produtos por categoria
    const topCategories = await categoryService.getTopCategoriesWithMostProducts(100);
    console.log(`[ShopCategories] Recebidas ${topCategories.length} categorias com contagem de produtos`);

    // Criar um mapa de contagem de produtos por categoria
    const productCountMap = {};
    topCategories.forEach(category => {
      productCountMap[category.id] = category.productCount;
    });

    // Construir a árvore de categorias
    const categoryTree = categoryService.buildCategoryTree(allCategories);

    // Filtrar categorias sem produtos
    const filteredCategoryTree = categoryService.filterCategoryTree(categoryTree, productCountMap);

    // Extrair todas as categorias da árvore filtrada (incluindo subcategorias)
    const extractAllCategories = (tree, result = []) => {
      tree.forEach(category => {
        result.push(category);
        if (category.children && category.children.length > 0) {
          extractAllCategories(category.children, result);
        }
      });
      return result;
    };

    const allFilteredCategories = extractAllCategories(filteredCategoryTree);
    console.log(`[ShopCategories] Total de categorias filtradas: ${allFilteredCategories.length}`);

    // Ordenar por quantidade de produtos (decrescente) e pegar as 3 primeiras
    categories.value = allFilteredCategories
      .sort((a, b) => (productCountMap[b.id] || 0) - (productCountMap[a.id] || 0))
      .slice(0, 3);

    console.log(`[ShopCategories] Exibindo as 3 categorias com mais produtos: ${categories.value.map(c => c.name).join(', ')}`);

    // Buscar produtos para as categorias selecionadas
    await fetchProductsForCategories();
  } catch (err) {
    console.error('Error fetching categories:', err);
    categories.value = [];
  }
};

const fetchProductsForCategories = async () => {
  try {
    for (const category of firstThreeCategories.value) {
      if (category?.id) {
        const response = await productService.getProducts({
          categoryId: category.id,
          limit: 5,
          page: 1
        });
        categoryProducts.value[category.id] = response.items.map(item => item.name);
      }
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

const navigateToCategory = (categoryId) => {
  if (categoryId) {
    router.push({
      path: `/categories/${categoryId}`
    });
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>






