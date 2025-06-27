<template>
  <div class="project-selector relative">
    <!-- Combobox de projetos (visível quando logado e tem 1 ou mais projetos) - Desktop -->
    <div v-if="isAuthenticated && projects.length >= 1" class="relative project-dropdown hidden md:block" ref="projectDropdownRef">
      <button
        @click="toggleProjectDropdown"
        :class="[
          'text-[15px] leading-7 text-white font-archivo font-medium flex items-center gap-1',
          projects.length <= 1 ? 'cursor-default' : 'cursor-pointer'
        ]"
        :disabled="isLoading"
        style="max-width: 250px;"
      >
        <span
          v-if="selectedProject"
          class="truncate max-w-[210px]"
          :title="selectedProject.name || selectedProject.nome"
        >
          {{ (selectedProject.name || selectedProject.nome).length > 20 ? (selectedProject.name || selectedProject.nome).substring(0, 20) + '...' : (selectedProject.name || selectedProject.nome) }}
        </span>
        <span v-else>{{ $t('project.selectProject') }}</span>
        <svg
          v-if="projects.length > 1"
          class="w-4 h-4 flex-shrink-0"
          :class="{ 'transform rotate-180': isProjectDropdownOpen }"
          viewBox="0 0 24 24"
          fill="#FFDD00"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      <!-- Dropdown Desktop -->
      <div v-if="isProjectDropdownOpen" class="absolute top-full left-0 z-50">
        <div class="menu-level bg-black py-1 max-h-[500px] overflow-y-auto border-0 border-none" style="width: 250px; background-color: #000000;">
          <!-- Loading State -->
          <div v-if="isLoading" class="px-4 py-2 text-empire-yellow">
            {{ $t('common.loading') }}...
          </div>

          <!-- Projects List -->
          <template v-else>
            <div
              v-for="project in projects"
              :key="project.id"
              class="project-item"
            >
              <div
                :class="[
                  'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 group font-medium tracking-wide whitespace-nowrap overflow-hidden truncate',
                  selectedProject && selectedProject.id === project.id ? 'bg-empire-yellow text-black' : 'text-white hover:bg-empire-yellow hover:text-black'
                ]"
                :title="project.name || project.nome"
                @click="selectProject(project)"
              >
                <!-- Project Name -->
                {{ (project.name || project.nome).length > 20 ? (project.name || project.nome).substring(0, 20) + '...' : (project.name || project.nome) }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Versão Mobile -->
    <div v-if="isAuthenticated && projects.length >= 1" class="relative project-dropdown md:hidden" ref="projectDropdownRefMobile">
      <button
        @click="toggleProjectDropdown"
        :class="[
          'px-1 py-1 text-[13px] leading-6 text-white font-archivo font-medium text-center flex items-center justify-center gap-1',
          projects.length <= 1 ? 'cursor-default' : 'cursor-pointer'
        ]"
        :disabled="isLoading"
        style="max-width: 120px; min-width: 80px;"
      >
        <span v-if="selectedProject" class="truncate max-w-[80px]" :title="selectedProject.name || selectedProject.nome">
          {{ (selectedProject.name || selectedProject.nome).length > 10 ? (selectedProject.name || selectedProject.nome).substring(0, 10) + '...' : (selectedProject.name || selectedProject.nome) }}
        </span>
        <span v-else class="truncate max-w-[80px]">{{ $t('project.selectProject') }}</span>
        <svg
          v-if="projects.length > 1"
          class="w-3 h-3 flex-shrink-0 transition-transform duration-200"
          :class="{ 'transform rotate-180': isProjectDropdownOpen }"
          viewBox="0 0 24 24"
          fill="#FFDD00"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      <!-- Dropdown Mobile -->
      <div
        v-if="isProjectDropdownOpen"
        class="absolute top-full bg-black shadow-lg z-50 rounded-lg mt-2 left-1/2 transform -translate-x-1/2 mobile-project-menu"
        style="width: 180px;"
      >
        <div class="max-h-[40vh] overflow-y-auto py-1">
          <div
            v-for="project in projects"
            :key="project.id"
            class="relative project-item"
          >
            <div
              :class="['flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-200 group font-medium text-[13px] leading-5 mobile-project-item', selectedProject && selectedProject.id === project.id ? 'bg-empire-yellow text-black' : 'text-white hover:bg-empire-yellow hover:text-black']"
              @click="selectProject(project)"
            >
              <!-- Nome do projeto -->
              <span
                class="truncate max-w-[140px]"
                :title="project.name || project.nome"
              >
                {{ (project.name || project.nome).length > 15 ? (project.name || project.nome).substring(0, 15) + '...' : (project.name || project.nome) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação para troca de projeto -->
    <div v-if="showConfirmationModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="cancelProjectChange"></div>

      <!-- Modal Content -->
      <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="font-archivo-narrow font-semibold text-2xl mb-6 text-center">{{ $t('project.changeConfirmation.title') }}</h2>

        <p class="mb-6 text-center">
          {{ $t('project.changeConfirmation.message') }}
        </p>

        <div class="flex flex-col gap-4">
          <button
            @click="confirmProjectChange"
            class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black"
          >
            {{ $t('project.changeConfirmation.confirm') }}
          </button>

          <button
            @click="cancelProjectChange"
            class="w-full bg-white border border-gray-300 py-4 font-archivo-narrow font-semibold text-xl text-black"
          >
            {{ $t('project.changeConfirmation.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Message -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-black text-empire-yellow px-6 py-4 rounded-md shadow-lg z-50 transition-opacity duration-300"
      :class="{ 'opacity-0': !showToast, 'opacity-100': showToast }"
    >
      <p class="font-archivo-narrow text-lg">
        {{ toastMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { projectService } from '@/services/projectService'
import { useCartStore } from '@/stores/cartStore'
import eventBus from '@/utils/eventBus'

export default {
  name: 'ProjectSelector',
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    const cartStore = useCartStore()

    const projects = ref([])
    const isLoading = ref(false)
    const selectedProjectId = ref('')
    const tempSelectedProjectId = ref('')
    const showConfirmationModal = ref(false)
    const isProjectDropdownOpen = ref(false)
    const showToast = ref(false)
    const toastMessage = ref('')
    const projectDropdownRef = ref(null)
    const projectDropdownRefMobile = ref(null)
    const selectedProject = ref(null)

    // Carrega os projetos do usuário
    const loadProjects = async () => {
      if (!props.isAuthenticated) return

      isLoading.value = true

      try {
        // Busca os projetos do usuário logado usando o token JWT
        const userProjects = await projectService.getCurrentUserProjects()
        projects.value = userProjects

        // Carrega o projeto selecionado do sessionStorage
        const savedProject = projectService.getSelectedProject()

        // Verifica se o projeto salvo existe na lista de projetos do usuário
        if (savedProject && savedProject.id) {
          const projectExists = userProjects.some(p => p.id === savedProject.id)

          if (projectExists) {
            selectedProjectId.value = savedProject.id
            selectedProject.value = savedProject
          } else {
            // Se o projeto salvo não existir na lista, seleciona o primeiro
            if (userProjects.length > 0) {
              selectedProjectId.value = userProjects[0].id
              selectedProject.value = {
                id: userProjects[0].id,
                name: userProjects[0].name || userProjects[0].nome
              }
              projectService.saveSelectedProject(selectedProject.value)
            }
          }
        } else if (userProjects.length > 0) {
          // Se não houver projeto selecionado, seleciona o primeiro da lista
          selectedProjectId.value = userProjects[0].id
          selectedProject.value = {
            id: userProjects[0].id,
            name: userProjects[0].name || userProjects[0].nome
          }
          projectService.saveSelectedProject(selectedProject.value)
          console.log('Nenhum projeto salvo, selecionando o primeiro:', selectedProject.value)
        }
      } catch (err) {
        console.error('Erro ao carregar projetos:', err)
      } finally {
        isLoading.value = false
      }
    }

    // Toggle do dropdown de projetos
    const toggleProjectDropdown = (event) => {
      event.stopPropagation()

      // Se há apenas 1 projeto, não abre o dropdown
      if (projects.value.length <= 1) {
        return
      }

      isProjectDropdownOpen.value = !isProjectDropdownOpen.value

      // Se o dropdown estiver sendo aberto, emite um evento para fechar outros dropdowns
      if (isProjectDropdownOpen.value) {
        eventBus.emit('dropdown-opened', 'project')
      }
    }

    // Método para fechar o dropdown de projetos
    const closeDropdown = () => {
      if (isProjectDropdownOpen.value) {
        isProjectDropdownOpen.value = false
      }
    }

    // Função para fechar o dropdown quando clica fora
    const handleClickOutside = (event) => {
      const projectDropdown = event.target.closest('.project-dropdown')

      // Fecha o menu de projetos apenas quando clicar fora dele
      if (!projectDropdown) {
        isProjectDropdownOpen.value = false
      }
    }

    // Adiciona o event listener quando o componente é montado
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    // Remove o event listener quando o componente é desmontado
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // Seleciona um projeto
    const selectProject = (project) => {
      // Verifica se o projeto selecionado é o mesmo que já estava selecionado
      if (selectedProjectId.value === project.id) {
        // Apenas fecha o dropdown sem mostrar o modal
        isProjectDropdownOpen.value = false
        return
      }

      // Se for um projeto diferente, mostra o modal de confirmação
      tempSelectedProjectId.value = project.id
      isProjectDropdownOpen.value = false
      showConfirmationModal.value = true
    }

    // Manipula a mudança de projeto (para compatibilidade com o select anterior)
    const handleProjectChange = (event) => {
      tempSelectedProjectId.value = event.target.value
      showConfirmationModal.value = true
    }

    // Exibe o toast personalizado
    const showSuccessToast = (message) => {
      toastMessage.value = message
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000) // Toast desaparece após 3 segundos
    }

    // Confirma a mudança de projeto
    const confirmProjectChange = async () => {
      try {
        isLoading.value = true

        // Encontra o projeto selecionado
        const project = projects.value.find(p => p.id === tempSelectedProjectId.value)
        if (!project) {
          throw new Error('Projeto não encontrado')
        }

        // Atualiza o projeto selecionado
        selectedProject.value = {
          id: project.id,
          name: project.name || project.nome
        }

        // Salva o novo projeto selecionado
        // O serviço irá emitir o evento 'selected-project-changed'
        projectService.saveSelectedProject(selectedProject.value)

        // Limpa o carrinho
        await cartStore.clearCart()

        // Atualiza o ID do projeto selecionado
        selectedProjectId.value = tempSelectedProjectId.value

        // Exibe mensagem de sucesso
        showSuccessToast(t('project.changeConfirmation.success'))

        // Fecha o modal
        showConfirmationModal.value = false
      } catch (err) {
        console.error('Erro ao mudar de projeto:', err)
        showSuccessToast(t('project.changeConfirmation.error'))
      } finally {
        isLoading.value = false
      }
    }

    // Cancela a mudança de projeto
    const cancelProjectChange = () => {
      // Restaura o valor anterior
      tempSelectedProjectId.value = selectedProjectId.value
      // Fecha o modal
      showConfirmationModal.value = false
    }

    // Observa mudanças na autenticação
    watch(() => props.isAuthenticated, (newValue) => {
      if (newValue) {
        loadProjects()

        // Verifica o sessionStorage após um pequeno atraso para garantir que os projetos foram carregados
        setTimeout(() => {
          checkSessionStorageProject()
        }, 500)
      } else {
        projects.value = []
        selectedProjectId.value = ''
      }
    })

    // Função para verificar e atualizar o projeto selecionado diretamente do sessionStorage
    const checkSessionStorageProject = () => {
      if (!props.isAuthenticated) return

      const savedProject = projectService.getSelectedProject()

      if (savedProject && savedProject.id) {
        // Verifica se o projeto existe na lista de projetos
        const projectExists = projects.value.some(p => p.id === savedProject.id)

        if (projectExists) {
          // Atualiza diretamente o projeto selecionado
          selectedProjectId.value = savedProject.id
          selectedProject.value = savedProject

          return true
        }
      }

      return false
    }

    // Carrega os projetos quando o componente é montado
    onMounted(() => {
      if (props.isAuthenticated) {
        loadProjects()

        // Verifica o sessionStorage após um pequeno atraso para garantir que os projetos foram carregados
        setTimeout(() => {
          checkSessionStorageProject()
        }, 500)

        // Configura um intervalo para verificar periodicamente o projeto no sessionStorage
        const intervalId = setInterval(() => {
          if (props.isAuthenticated) {
            checkSessionStorageProject()
          }
        }, 2000) // Verifica a cada 2 segundos

        // Limpa o intervalo quando o componente é desmontado
        onUnmounted(() => {
          clearInterval(intervalId)
        })
      }

      // Adiciona um event listener para detectar mudanças no sessionStorage
      window.addEventListener('storage', (event) => {
        if (event.key === 'selectedProject' && props.isAuthenticated) {
          console.log('Projeto alterado no sessionStorage, verificando...')
          // Verifica diretamente o sessionStorage
          const success = checkSessionStorageProject()
          if (!success) {
            // Se não encontrou o projeto, recarrega todos os projetos
            console.log('Projeto não encontrado no sessionStorage, recarregando projetos...')
            loadProjects()
          }
        }
      })

      // Adiciona um listener para o evento project-changed
      eventBus.on('project-changed', (projectData) => {
        console.log('Evento project-changed recebido:', projectData)
        if (props.isAuthenticated && projectData && projectData.id) {
          // Verifica se o projeto existe na lista de projetos
          const projectExists = projects.value.some(p => p.id === projectData.id)
          console.log('Projeto existe na lista?', projectExists, 'ID:', projectData.id)

          if (projectExists) {
            // Atualiza diretamente o projeto selecionado sem recarregar todos os projetos
            selectedProjectId.value = projectData.id
            selectedProject.value = projectData
            console.log('Projeto atualizado via evento:', selectedProject.value)
          } else {
            // Se o projeto não existir na lista, recarrega os projetos
            console.log('Projeto não encontrado na lista, recarregando projetos...')
            loadProjects()
          }
        }
      })

      // Adiciona um listener para o evento selected-project-changed
      eventBus.on('selected-project-changed', (projectData) => {
        console.log('Evento selected-project-changed recebido:', projectData)

        // Se o projectData for null, significa que o usuário fez logout
        if (projectData === null) {
          console.log('Projeto removido (logout)');
          selectedProjectId.value = '';
          selectedProject.value = null;
          return;
        }

        if (props.isAuthenticated && projectData && projectData.id) {
          // Verifica se o projeto existe na lista de projetos
          const projectExists = projects.value.some(p => p.id === projectData.id)
          console.log('Projeto existe na lista?', projectExists, 'ID:', projectData.id)

          if (projectExists) {
            // Atualiza diretamente o projeto selecionado sem recarregar todos os projetos
            selectedProjectId.value = projectData.id
            selectedProject.value = projectData
            console.log('Projeto atualizado via evento selected-project-changed:', selectedProject.value)
          } else {
            // Se o projeto não existir na lista, recarrega os projetos
            console.log('Projeto não encontrado na lista, recarregando projetos...')
            loadProjects()
          }
        }
      })

      // Adiciona um listener para o evento dropdown-opened
      eventBus.on('dropdown-opened', (source) => {
        // Se o evento vier de outro dropdown, fecha este
        if (source !== 'project' && isProjectDropdownOpen.value) {
          console.log('Outro dropdown foi aberto, fechando dropdown de projetos')
          isProjectDropdownOpen.value = false
        }
      })
    })

    // Remove os event listeners quando o componente é desmontado
    const cleanup = () => {
      console.log('Removendo event listeners...')
      document.removeEventListener('click', handleClickOutside)

      // Remove o event listener do storage
      const storageHandler = (event) => {
        if (event.key === 'selectedProject' && props.isAuthenticated) {
          console.log('Projeto alterado no sessionStorage, verificando...')
          checkSessionStorageProject()
        }
      }
      window.removeEventListener('storage', storageHandler)

      // Remove os listeners do eventBus
      eventBus.off('project-changed')
      eventBus.off('dropdown-opened')
      eventBus.off('selected-project-changed')
    }

    onUnmounted(cleanup)

    // Computed para verificar se há projetos disponíveis
    const hasProjects = computed(() => projects.value.length > 0)

    return {
      projects,
      isLoading,
      selectedProjectId,
      selectedProject,
      showConfirmationModal,
      isProjectDropdownOpen,
      projectDropdownRef,
      projectDropdownRefMobile,
      showToast,
      toastMessage,
      hasProjects,
      handleProjectChange,
      toggleProjectDropdown,
      selectProject,
      confirmProjectChange,
      cancelProjectChange,
      showSuccessToast,
      checkSessionStorageProject,
      closeDropdown
    }
  }
}
</script>

<style scoped>
.project-dropdown {
  position: relative;
}

.project-dropdown .absolute {
  position: absolute;
  z-index: 100;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select::-ms-expand {
  display: none;
}

select option {
  background-color: #1E1E1E;
  color: white;
  padding: 8px;
}
</style>
