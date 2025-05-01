<template>
  <div class="product-search-combobox w-full">
    <!-- Toast Message -->
    <div
      v-if="showToast"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-black text-empire-yellow px-4 sm:px-6 py-3 sm:py-4 rounded-md shadow-lg z-50 transition-opacity duration-300 text-center sm:text-left"
    >
      <p class="font-archivo-narrow text-base sm:text-lg">
        {{ $t('cart.productAdded') }}
      </p>
    </div>
    <div class="relative">
      <!-- Campo de pesquisa -->
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('productSearch.searchPlaceholder')"
          class="w-full p-3 sm:p-4 pr-10 sm:pr-12 border-2 border-black/25 rounded font-archivo text-sm sm:text-base focus:outline-none focus:border-empire-yellow"
          @focus="showResults = true"
          @input="debouncedSearch"
        />
        <div class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Resultados da pesquisa -->
      <div v-if="showResults && searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg max-h-[300px] sm:max-h-[400px] overflow-y-auto">
        <div v-for="product in searchResults" :key="product.id" class="product-item border-b border-gray-200 last:border-b-0 py-1">
          <div class="flex flex-col sm:flex-row items-start sm:items-center p-4 hover:bg-gray-100 cursor-pointer" @click="selectProduct(product)">
            <!-- Layout para desktop -->
            <div class="hidden sm:flex sm:flex-row sm:items-center sm:w-full">
              <img
                :src="product.image || '/images/products/no-image.png'"
                :alt="product.name"
                class="w-16 h-16 object-cover mr-4"
                @error="handleImageError"
              />
              <div class="flex-grow">
                <!-- Descrição do produto em negrito -->
                <div class="font-archivo font-bold text-lg text-gray-800 truncate" v-html="highlightMatch(product.description, searchQuery)"></div>
                <!-- Nome do produto com fonte mais leve -->
                <div class="font-archivo font-light text-sm text-gray-600 truncate" v-html="highlightMatch(product.name, searchQuery)"></div>
                <div v-if="showPrices" class="font-archivo text-base text-black/70 mt-1">{{ formatPrice(product.price) }}</div>
              </div>
              <div class="flex items-center">
                <div class="flex border border-black/25 mr-2">
                  <button
                    @click.stop="decreaseQuantity(product)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    -
                  </button>
                  <span class="px-3 py-1">{{ getProductQuantity(product) }}</span>
                  <button
                    @click.stop="increaseQuantity(product)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
                <button
                  @click.stop="addToCart(product)"
                  class="bg-empire-yellow px-3 py-1 font-archivo-narrow font-semibold text-sm hover:opacity-90"
                >
                  {{ $t('cart.addToCart') }}
                </button>
              </div>
            </div>

            <!-- Layout otimizado para mobile -->
            <div class="flex sm:hidden flex-row w-full">
              <img
                :src="product.image || '/images/products/no-image.png'"
                :alt="product.name"
                class="w-16 h-16 object-cover mr-4 flex-shrink-0"
                @error="handleImageError"
              />
              <div class="flex-grow flex flex-col justify-between">
                <div>
                  <!-- Descrição do produto em negrito -->
                  <div class="font-archivo font-bold text-[15px] line-clamp-1 mb-1.5 text-gray-800" v-html="highlightMatch(product.description, searchQuery)"></div>
                  <!-- Nome do produto com fonte mais leve -->
                  <div class="font-archivo font-light text-xs text-gray-600 truncate mb-1.5" v-html="highlightMatch(product.name, searchQuery)"></div>
                  <div v-if="showPrices" class="font-archivo text-sm text-black/70 mb-3">{{ formatPrice(product.price) }}</div>
                </div>

                <div class="flex items-center">
                  <div class="flex border border-black/25 mr-2 h-7">
                    <button
                      @click.stop="decreaseQuantity(product)"
                      class="px-2 hover:bg-black/5 text-sm flex items-center justify-center w-7"
                    >
                      -
                    </button>
                    <span class="px-2 py-0.5 text-sm flex items-center justify-center min-w-[24px]">{{ getProductQuantity(product) }}</span>
                    <button
                      @click.stop="increaseQuantity(product)"
                      class="px-2 hover:bg-black/5 text-sm flex items-center justify-center w-7"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click.stop="addToCart(product)"
                    class="bg-empire-yellow px-3 py-1 font-archivo-narrow font-semibold text-sm hover:opacity-90 h-7 flex items-center justify-center min-w-[80px]"
                  >
                    {{ $t('cart.addToCart') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem de nenhum resultado -->
      <div v-else-if="showResults && searchQuery && !loading" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg p-3 sm:p-4 text-center">
        <p class="font-archivo text-sm sm:text-base text-black/70">{{ $t('productSearch.noResults') }}</p>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading && showResults" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg p-3 sm:p-4 text-center">
        <p class="font-archivo text-sm sm:text-base text-black/70">{{ $t('common.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { settingsService } from '@/services/settingsService'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'

export default {
  name: 'ProductSearchCombobox',
  setup() {
    const { locale } = useI18n() // Obtemos a referência ao locale para uso posterior
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()

    const searchQuery = ref('')
    const searchResults = ref([])
    const showResults = ref(false)
    const loading = ref(false)
    const currencySymbol = ref('$')
    const showPrices = ref(true)
    const showToast = ref(false)

    // Mapa para armazenar as quantidades selecionadas para cada produto
    const selectedQuantities = reactive({})

    // Debounce para a pesquisa
    let debounceTimeout = null

    const debouncedSearch = () => {
      // Limpa o timeout anterior se existir
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
      }

      // Se a query estiver vazia, limpa os resultados
      if (!searchQuery.value || searchQuery.value.trim() === '') {
        searchResults.value = [];
        loading.value = false;
        return;
      }

      // Mostra o indicador de carregamento
      loading.value = true;

      // Define um novo timeout
      debounceTimeout = setTimeout(() => {
        // Chama a função de busca
        searchProducts();
      }, 300);
    }

    // Função para normalizar texto (remover acentos e caracteres especiais)
    const normalizeText = (text) => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Substitui caracteres especiais por espaços
        .replace(/\s+/g, ' ')     // Substitui múltiplos espaços por um único espaço
        .trim();
    }

    const searchProducts = async () => {
      if (!searchQuery.value || searchQuery.value.trim() === '') {
        searchResults.value = []
        loading.value = false
        return
      }

      try {
        loading.value = true

        // Verifica se a consulta está entre aspas duplas para busca exata
        const isExactSearch = searchQuery.value.startsWith('"') && searchQuery.value.endsWith('"')
        let searchTerm = searchQuery.value

        if (isExactSearch) {
          // Remove as aspas para busca exata
          searchTerm = searchQuery.value.slice(1, -1)
        }

        // Usa o idioma atual para selecionar o campo de descrição correto
        const descriptionField = `description_${locale.value || 'en'}`

        // Para pesquisas com múltiplas palavras, vamos processar cada palavra separadamente
        // e formatar para o backend usando a sintaxe %TERMO%
        let searchTermForAPI;

        if (searchTerm && searchTerm.includes(' ')) {
          // Dividir a string em palavras
          const words = searchTerm.split(/\s+/).filter(word => word.length > 0);

          if (words.length > 1) {
            // Formatar cada palavra com % e juntar com &&
            searchTermForAPI = words.map(word => `%${word}%`).join(' && ');
          } else {
            // Se só tiver uma palavra após a divisão
            searchTermForAPI = `%${words[0] || ''}%`;
          }
        } else {
          // Se não tiver espaços, é uma única palavra
          searchTermForAPI = `%${searchTerm || ''}%`;
        }

        // Usa o serviço de produtos para buscar produtos
        const response = await productService.getProducts({
          search: searchTermForAPI,
          limit: 20
        });

        if (!response || !response.items) {
          searchResults.value = []
          loading.value = false
          return
        }

        // Processa as imagens dos produtos e adiciona a descrição localizada
        let processedProducts = (response.items || []).map(product => {
          // Seleciona a descrição no idioma atual ou usa fallback para inglês
          const description = product[descriptionField] || product.description_en || product.description_fr || ''

          return {
            ...product,
            // Adiciona a descrição localizada
            description: description,
            // Adiciona campos normalizados para facilitar a busca
            normalizedName: normalizeText(product.name || ''),
            normalizedDescription: normalizeText(description)
          };
        });

        // Se a pesquisa tiver múltiplas palavras, vamos filtrar os resultados para garantir
        // que todos os termos estejam presentes no nome ou na descrição
        if (!isExactSearch && searchTerm.includes(' ')) {
          const normalizedSearchTerm = normalizeText(searchTerm);
          const keywords = normalizedSearchTerm.split(' ').filter(k => k.length > 0);

          // Filtra os resultados para garantir que todas as palavras-chave estejam presentes
          processedProducts = processedProducts.filter(product => {
            // Texto completo normalizado (nome + descrição)
            const productText = product.normalizedName + ' ' + product.normalizedDescription;

            // Verifica se todas as palavras-chave estão presentes
            return keywords.every(keyword => productText.includes(keyword));
          });

          // Ordena os resultados por relevância (número de ocorrências das palavras-chave)
          processedProducts.sort((a, b) => {
            const textA = a.normalizedName + ' ' + a.normalizedDescription;
            const textB = b.normalizedName + ' ' + b.normalizedDescription;

            // Conta ocorrências de todas as palavras-chave
            let matchesA = 0;
            let matchesB = 0;

            keywords.forEach(keyword => {
              // Conta ocorrências de cada palavra-chave
              const regexKeyword = new RegExp(keyword, 'g');
              const matchesInA = (textA.match(regexKeyword) || []).length;
              const matchesInB = (textB.match(regexKeyword) || []).length;

              matchesA += matchesInA;
              matchesB += matchesInB;
            });

            // Ordena por número de ocorrências (decrescente)
            return matchesB - matchesA;
          });
        }

        searchResults.value = processedProducts

        // Inicializa as quantidades para os produtos encontrados
        searchResults.value.forEach(product => {
          if (!selectedQuantities[product.id]) {
            selectedQuantities[product.id] = 1
          }
        })
      } catch (error) {
        console.error('Error searching products:', error)
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }

    const selectProduct = (product) => {
      // Redireciona para a página de detalhes do produto
      window.location.href = `/product/${product.id}`
    }

    const getProductQuantity = (product) => {
      return selectedQuantities[product.id] || 1
    }

    const increaseQuantity = (product) => {
      if (!selectedQuantities[product.id]) {
        selectedQuantities[product.id] = 1
      }
      selectedQuantities[product.id]++
    }

    const decreaseQuantity = (product) => {
      if (!selectedQuantities[product.id]) {
        selectedQuantities[product.id] = 1
      }
      if (selectedQuantities[product.id] > 1) {
        selectedQuantities[product.id]--
      }
    }

    const addToCart = (product) => {
      const quantity = selectedQuantities[product.id] || 1

      cartStore.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/products/no-image.png',
        quantity: quantity
      })

      // Reset quantity after adding to cart
      selectedQuantities[product.id] = 1

      // Show toast notification
      showSuccessToast()
    }

    const showSuccessToast = () => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000) // Toast desaparece após 3 segundos
    }

    const handleImageError = (e) => {
      e.target.src = PLACEHOLDER_IMAGE_PATH
      e.target.onerror = null // Previne loop infinito
    }

    const formatPrice = (price) => {
      return `${currencySymbol.value}${Number(price).toFixed(2)}`
    }

    // Função para escapar caracteres especiais em expressões regulares
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Função para destacar a correspondência na busca de forma segura
    const highlightMatch = (text, query) => {
      // Verificações de segurança
      if (!text || typeof text !== 'string') return '';
      if (!query || typeof query !== 'string' || query.trim() === '') return text;

      try {
        // Cria uma cópia do texto para não modificar o original
        let safeText = String(text);

        // Verifica se a consulta está entre aspas duplas para busca exata
        const isExactSearch = query.startsWith('"') && query.endsWith('"');
        let searchTerm = isExactSearch ? query.slice(1, -1) : query;

        // Se o termo de busca estiver vazio após processamento, retorna o texto original
        if (!searchTerm || searchTerm.trim() === '') return safeText;

        // Normaliza a consulta para comparação
        const normalizedSearchTerm = normalizeText(searchTerm);

        // Divide a consulta em palavras-chave
        const keywords = normalizedSearchTerm.split(' ').filter(k => k && k.length > 0);

        // Se não houver palavras-chave válidas, retorna o texto original
        if (!keywords || keywords.length === 0) return safeText;

        // Cria uma versão segura do texto para destacar
        let highlightedText = safeText;

        // Destaca cada palavra-chave individualmente
        keywords.forEach(keyword => {
          if (keyword && keyword.length >= 2) { // Ignora palavras muito curtas
            try {
              // Escapa caracteres especiais na palavra-chave
              const pattern = escapeRegExp(keyword);

              // Cria uma expressão regular segura
              const regex = new RegExp(`(${pattern})`, 'gi');

              // Substitui as ocorrências pela versão destacada
              highlightedText = highlightedText.replace(regex, '<span class="bg-yellow-200 text-black font-bold px-0.5 rounded">$1</span>');
            } catch (e) {
              // Ignora erros de regex e continua com a próxima palavra-chave
            }
          }
        });

        return highlightedText;
      } catch (error) {
        // Em caso de qualquer erro, retorna o texto original
        return text;
      }
    }

    const loadFinancialSettings = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol

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
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Fecha os resultados quando clicar fora do componente
    const handleClickOutside = (event) => {
      const combobox = document.querySelector('.product-search-combobox')
      if (combobox && !combobox.contains(event.target)) {
        showResults.value = false
      }
    }

    onMounted(() => {
      loadFinancialSettings()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // Observa mudanças no toggle master
    watch(() => togglesStore.masterToggle, (newValue) => {
      showPrices.value = newValue
    })

    return {
      searchQuery,
      searchResults,
      showResults,
      loading,
      selectedQuantities,
      showPrices,
      showToast,
      debouncedSearch,
      selectProduct,
      getProductQuantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      showSuccessToast,
      handleImageError,
      formatPrice,
      highlightMatch
    }
  }
}
</script>

<style scoped>
.product-search-combobox {
  position: relative;
}

/* Estilização da barra de rolagem */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #FFDD00 #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #FFDD00;
}

/* Limita o texto a uma linha com elipse */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsividade já está implementada com classes do Tailwind */
</style>
