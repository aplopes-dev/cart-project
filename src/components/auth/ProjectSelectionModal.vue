<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="font-archivo-narrow font-semibold text-2xl mb-6 text-center">{{ $t('auth.selectProject') }}</h2>

      <!-- Mensagem de carregamento -->
      <div v-if="isLoading" class="mb-6 text-center">
        <p class="font-archivo text-lg">{{ $t('auth.loadingProjects') }}</p>
      </div>

      <!-- Mensagem de erro -->
      <div v-else-if="error" class="mb-6 text-center">
        <p class="font-archivo text-lg text-red-600">{{ error }}</p>
        <button
          @click="loadProjects"
          class="mt-2 bg-empire-yellow px-4 py-2 font-archivo-narrow font-semibold text-black"
        >
          {{ $t('auth.retry') }}
        </button>
      </div>

      <!-- Mensagem de nenhum projeto encontrado -->
      <div v-else-if="projects.length === 0" class="mb-6 text-center">
        <p class="font-archivo text-lg">{{ $t('auth.noProjectsFound') }}</p>
      </div>

      <!-- Combobox para seleção de projeto -->
      <div v-else class="mb-6">
        <label for="project-select" class="block font-archivo text-lg mb-2">{{ $t('auth.project') }}</label>
        <select
          id="project-select"
          v-model="selectedProject"
          class="w-full p-4 border border-gray-300 focus:outline-none focus:border-empire-yellow"
        >
          <option value="" disabled>{{ $t('auth.selectProjectPlaceholder') }}</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name || project.nome }}
          </option>
        </select>
      </div>

      <!-- Botão de confirmação -->
      <button
        @click="confirmSelection"
        :disabled="isLoading || (projects.length > 0 && !selectedProject)"
        class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black disabled:opacity-50"
      >
        {{ projects.length === 0 ? $t('auth.close') : $t('auth.confirm') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { projectService } from '@/services/projectService'
import { useStore } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
  name: 'ProjectSelectionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    redirectPath: {
      type: String,
      default: '/'
    }
  },
  emits: ['close', 'project-selected'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const store = useStore()
    const selectedProject = ref('')
    const projects = ref([])
    const isLoading = ref(false)
    const error = ref('')

    const closeModal = () => {
      // Se não houver projetos, remover qualquer projeto salvo no sessionStorage
      if (projects.value.length === 0) {
        console.log('Nenhum projeto encontrado, removendo projeto do sessionStorage')
        sessionStorage.removeItem('selectedProject')
      }
      emit('close')
    }

    const confirmSelection = () => {
      if (projects.value.length === 0) {
        // Se não houver projetos, remover qualquer projeto salvo no sessionStorage e fechar o modal
        console.log('Nenhum projeto encontrado, removendo projeto do sessionStorage')
        sessionStorage.removeItem('selectedProject')
        emit('close')
        return
      }

      if (selectedProject.value) {
        const project = projects.value.find(p => p.id === selectedProject.value)
        if (!project) {
          console.error('Projeto não encontrado na lista:', selectedProject.value)
          emit('close')
          return
        }

        // Salva o projeto no sessionStorage
        const projectData = {
          id: project.id,
          name: project.name || project.nome
        }

        // Salva no sessionStorage antes de emitir eventos
        projectService.saveSelectedProject(projectData)
        console.log('Projeto salvo no sessionStorage:', projectData)

        // Emite um evento para notificar outros componentes
        eventBus.emit('project-changed', projectData)
        console.log('Evento project-changed emitido com:', projectData)

        // Emite o evento para o componente pai
        emit('project-selected', {
          projectId: project.id,
          projectName: project.name || project.nome,
          redirectPath: props.redirectPath
        })
      }
    }

    // Carrega os projetos do usuário
    const loadProjects = async () => {
      isLoading.value = true
      error.value = ''

      try {
        // Obtém o email do usuário logado
        const user = store.state.currentUser
        if (!user || !user.email) {
          console.error('Usuário não encontrado no store:', store.state)
          throw new Error('Usuário não encontrado')
        }

        console.log('Buscando projetos para o usuário:', user.email)

        // Busca os projetos associados ao usuário
        const userProjects = await projectService.getProjectsByUserEmail(user.email)
        projects.value = userProjects

        // Se houver apenas um projeto, seleciona automaticamente
        if (userProjects.length === 1) {
          selectedProject.value = userProjects[0].id
        }
      } catch (err) {
        console.error('Erro ao carregar projetos:', err)
        error.value = t('auth.projectLoadError')
        projects.value = []
      } finally {
        isLoading.value = false
      }
    }

    // Carrega os projetos quando o componente é montado
    onMounted(() => {
      console.log('ProjectSelectionModal montado, carregando projetos...')
      loadProjects()
    })

    // Observa mudanças na propriedade show
    watch(() => props.show, (newValue) => {
      console.log('Propriedade show alterada:', newValue)
      if (newValue) {
        console.log('Modal exibido, carregando projetos...')
        loadProjects()
      }
    })

    return {
      selectedProject,
      projects,
      isLoading,
      error,
      closeModal,
      confirmSelection,
      loadProjects,
      t
    }
  }
}
</script>

<style scoped>
select:focus {
  outline: none;
  border-color: #FFDD00;
}
</style>
