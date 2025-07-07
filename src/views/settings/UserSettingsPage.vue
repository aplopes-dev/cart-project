<template>
  <!-- eslint-disable vue/no-ref-as-operand -->
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
          <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
          <span>/</span>
          <router-link to="/my-account" class="hover:text-black">
            {{ $t('myAccount.title') }}
          </router-link>
          <span>/</span>
          <router-link to="/settings" class="hover:text-black">
            {{ $t('systemSettings.title') }}
          </router-link>
          <span>/</span>
          <span class="text-black">{{ $t('systemSettings.users') }}</span>
        </nav>
      </div>

      <!-- Título da Página -->
      <div class="mb-6 md:mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="font-archivo-narrow font-semibold text-2xl md:text-3xl mb-1 md:mb-2">{{ $t('systemSettings.users') }}</h1>
            <p class="text-black/70 text-sm md:text-base">{{ $t('systemSettings.usersDescription') }}</p>
          </div>
          <button
            @click="openAddUserModal"
            class="bg-empire-yellow hover:opacity-90 text-black px-4 py-2 font-archivo-narrow font-semibold text-sm md:text-base transition-opacity"
          >
            {{ $t('users.addUser') }}
          </button>
        </div>
      </div>

      <!-- Filtros e Busca -->
      <div class="bg-[#FAFAFA] p-4 md:p-6 mb-4 md:mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <!-- Campo de Busca -->
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('users.searchPlaceholder')"
              class="w-full p-2 md:p-3 h-10 md:h-auto text-sm md:text-base border border-gray-300"
              @input="filterUsers"
            />
          </div>

          <!-- Filtro por Perfil -->
          <div class="w-full md:w-auto">
            <select
              v-model="profileFilter"
              class="w-full md:w-48 p-2 md:p-3 h-10 md:h-auto text-sm md:text-base border border-gray-300"
              @change="filterUsers"
            >
              <option value="">{{ $t('users.allProfiles') }}</option>
              <option value="ADMIN">{{ $t('users.admin') }}</option>
              <option value="MANAGER">{{ $t('users.manager') }}</option>
              <option value="USER">{{ $t('users.user') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de Usuários -->
      <div class="bg-white border border-gray-200 rounded-md overflow-hidden">
        <!-- Container com rolagem horizontal para mobile -->
        <div class="md:block overflow-x-auto">
        <!-- Cabeçalho da Tabela -->
        <div class="grid grid-cols-12 bg-gray-100 p-3 md:p-4 font-archivo font-semibold text-xs md:text-sm min-w-[600px] md:min-w-0">
          <div class="col-span-3">{{ $t('users.name') }}</div>
          <div class="col-span-4">{{ $t('users.email') }}</div>
          <div class="col-span-3">{{ $t('users.profile') }}</div>
          <div class="col-span-2 text-right">{{ $t('users.actions') }}</div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6 md:p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2">{{ $t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-6 md:p-8 text-center text-red-500">
          <p>{{ error }}</p>
          <button
            @click="loadUsers"
            class="mt-4 bg-empire-yellow text-black px-4 py-2"
          >
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredUsers.length === 0" class="p-6 md:p-8 text-center text-gray-500">
          <p>{{ $t('users.noUsersFound') }}</p>
        </div>

        <!-- User List -->
        <div v-else>
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="grid grid-cols-12 p-3 md:p-4 border-b border-gray-200 items-center text-xs md:text-sm min-w-[600px] md:min-w-0"
          >
            <div class="col-span-3 truncate">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="col-span-4 truncate">{{ user.email }}</div>
            <div class="col-span-3">
              <span
                :class="[
                  'px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold',
                  user.profile === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  user.profile === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                ]"
              >
                {{ $t(`users.${user.profile.toLowerCase()}`) }}
              </span>
            </div>
            <div class="col-span-2 text-right">
              <button
                @click="editUser(user)"
                class="text-empire-yellow hover:underline"
              >
                {{ $t('common.edit') }}
              </button>
            </div>
          </div>
        </div>

        </div>

        <!-- Paginação -->
        <div class="flex flex-col items-center mt-6 md:mt-8 mb-3 md:mb-4 w-full gap-3 md:gap-4">
          <!-- Informação de página -->
          <div class="text-xs md:text-sm text-gray-600">
            {{ $t('users.showing') }} {{ itemRange.start }}-{{ itemRange.end }} {{ $t('users.of') }} {{ totalItems }} {{ $t('users.items') }}
          </div>

          <div class="flex justify-center items-center gap-2 md:gap-4 w-full">
            <!-- Botão Previous -->
            <button
              class="flex items-center justify-center h-8 md:h-10 px-1 md:px-4 gap-1 rounded-lg min-w-[70px] md:min-w-[120px]"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F9F9FB] hover:bg-gray-200 cursor-pointer'"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              <svg class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" :stroke="currentPage === 1 ? '#9CA3AF' : '#1E1E1E'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-inter font-medium text-xs md:text-base">{{ $t('common.previous') }}</span>
            </button>

            <!-- Números das Páginas -->
            <div class="flex gap-1 md:gap-2">
              <button
                v-for="page in displayedPages"
                :key="page"
                class="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-xs md:text-base"
                :class="page === currentPage ? 'bg-black text-white' : 'bg-[#F9F9FB] text-black'"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <!-- Botão Next -->
            <button
              class="flex items-center justify-center h-8 md:h-10 px-1 md:px-4 gap-1 rounded-lg min-w-[70px] md:min-w-[120px]"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F9F9FB] hover:bg-gray-200 cursor-pointer'"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              <span class="font-inter font-medium text-xs md:text-base">{{ $t('common.next') }}</span>
              <svg class="w-3 h-3 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" :stroke="currentPage === totalPages ? '#9CA3AF' : '#1E1E1E'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 md:p-6 rounded-md w-full max-w-[90%] md:max-w-md">
        <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl mb-3 md:mb-4">{{ $t('users.editUser') }}</h2>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.name') }}</label>
          <p class="p-2 md:p-3 bg-gray-100 rounded text-sm md:text-base">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
        </div>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.email') }}</label>
          <p class="p-2 md:p-3 bg-gray-100 rounded text-sm md:text-base">{{ selectedUser.email }}</p>
        </div>

        <div class="mb-4 md:mb-6">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.profile') }}</label>
          <select
            v-model="selectedUser.profile"
            class="w-full p-2 md:p-3 h-10 md:h-auto text-sm md:text-base border border-gray-300 rounded"
          >
            <option value="ADMIN">{{ $t('users.admin') }}</option>
            <option value="MANAGER">{{ $t('users.manager') }}</option>
            <option value="USER">{{ $t('users.user') }}</option>
          </select>
        </div>

        <div class="flex justify-end gap-2 md:gap-3">
          <button
            @click="closeEditModal"
            class="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="saveUserProfile"
            :disabled="updateLoading"
            class="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-empire-yellow text-black rounded disabled:opacity-50"
          >
            {{ updateLoading ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Usuário -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 md:p-6 rounded-md w-full max-w-[90%] md:max-w-md">
        <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl mb-3 md:mb-4">{{ $t('users.addUser') }}</h2>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.firstName') }}</label>
          <input
            v-model="newUser.firstName"
            type="text"
            class="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded"
            :placeholder="$t('users.firstNamePlaceholder')"
          />
        </div>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.lastName') }}</label>
          <input
            v-model="newUser.lastName"
            type="text"
            class="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded"
            :placeholder="$t('users.lastNamePlaceholder')"
          />
        </div>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.email') }}</label>
          <input
            v-model="newUser.email"
            type="email"
            class="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded"
            :placeholder="$t('users.emailPlaceholder')"
          />
        </div>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.password') }}</label>
          <input
            v-model="newUser.password"
            type="password"
            class="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded"
            :placeholder="$t('users.passwordPlaceholder')"
          />
        </div>

        <div class="mb-3 md:mb-4">
          <label class="block text-gray-700 text-sm md:text-base mb-1 md:mb-2">{{ $t('users.profile') }}</label>
          <select
            v-model="newUser.profile"
            class="w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded"
          >
            <option value="">{{ $t('users.selectProfile') }}</option>
            <option value="ADMIN">{{ $t('users.admin') }}</option>
          </select>
        </div>

        <div class="flex justify-end gap-2 md:gap-3">
          <button
            @click="closeAddModal"
            class="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="createUser"
            :disabled="createLoading"
            class="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-empire-yellow text-black rounded disabled:opacity-50"
          >
            {{ createLoading ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { userService } from '@/services/userService'

const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

// Estado
const users = ref([])
const filteredUsers = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const profileFilter = ref('')
const showEditModal = ref(false)
const selectedUser = ref({})
const updateLoading = ref(false)

// Estado do modal de adicionar usuário
const showAddModal = ref(false)
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  profile: 'ADMIN'
})
const createLoading = ref(false)

// Estado da paginação
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

// Carregar usuários
const loadUsers = async () => {
  loading.value = true
  error.value = null

  try {
    // Busca os usuários do backend com os filtros atuais
    const filters = {
      search: searchQuery.value,
      profile: profileFilter.value,
      page: currentPage.value,
      limit: itemsPerPage
    }

    const data = await userService.getUsers(filters)
    console.log('API response:', data)
    users.value = data.items || []
    totalItems.value = data.total || 0
    totalPages.value = data.totalPages || 1
    currentPage.value = data.page || 1

    console.log('Pagination state:', {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalItems: totalItems.value,
      itemsPerPage
    })

    // Inicializa a lista filtrada com todos os usuários
    // Como já aplicamos os filtros na API, podemos simplesmente copiar os dados
    filteredUsers.value = [...users.value]
  } catch (err) {
    console.error('Error loading users:', err)
    error.value = t('users.loadError')
    toast.error(t('users.loadError'))
  } finally {
    loading.value = false
  }
}

// Filtrar usuários
const filterUsers = async () => {
  // Resetar para a primeira página ao aplicar filtros
  currentPage.value = 1
  await loadUsers()
}

// Abrir modal de edição
const editUser = (user) => {
  selectedUser.value = { ...user }
  showEditModal.value = true
}

// Fechar modal de edição
const closeEditModal = () => {
  showEditModal.value = false
  selectedUser.value = {}
}

// Abrir modal de adicionar usuário
const openAddUserModal = () => {
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profile: 'ADMIN'
  }
  showAddModal.value = true
}

// Fechar modal de adicionar usuário
const closeAddModal = () => {
  showAddModal.value = false
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profile: 'ADMIN'
  }
}

// Salvar perfil do usuário
const saveUserProfile = async () => {
  updateLoading.value = true

  try {
    // Chama a API para atualizar o perfil do usuário
    await userService.updateUserProfile(
      selectedUser.value.id,
      selectedUser.value.profile
    )

    // Recarrega a lista de usuários para obter os dados atualizados
    await loadUsers()

    toast.success(t('users.updateSuccess'))
    closeEditModal()
  } catch (err) {
    console.error('Error updating user profile:', err)
    toast.error(t('users.updateError'))
  } finally {
    updateLoading.value = false
  }
}

// Criar novo usuário
const createUser = async () => {
  if (!newUser.value.firstName || !newUser.value.lastName || !newUser.value.email || !newUser.value.password) {
    toast.error(t('users.fillAllFields'))
    return
  }

  createLoading.value = true
  try {
    await userService.createUser(newUser.value)

    // Recarrega a lista de usuários para incluir o novo usuário
    await loadUsers()

    toast.success(t('users.createSuccess'))
    closeAddModal()
  } catch (err) {
    console.error('Error creating user:', err)
    toast.error(t('users.createError'))
  } finally {
    createLoading.value = false
  }
}

// Computed para páginas a serem exibidas
const displayedPages = computed(() => {
  // Se não há páginas ou apenas uma página, retorna apenas a página 1
  if (totalPages.value <= 1) {
    return [1]
  }

  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Computed property para calcular o intervalo de itens
const itemRange = computed(() => {
  // Se não há itens, retorna 0-0
  if (totalItems.value === 0) {
    return { start: 0, end: 0 }
  }

  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, totalItems.value)
  return { start, end }
})

// Função para mudar de página
const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    await loadUsers()
    // Opcional: Rolar para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Inicialização
onMounted(() => {
  loadUsers()
})
</script>
