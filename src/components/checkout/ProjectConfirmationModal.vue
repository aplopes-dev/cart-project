<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="font-archivo-narrow font-semibold text-2xl mb-6 text-center">{{ $t('checkout.confirmProject.title') }}</h2>

      <!-- Mensagem de confirmação -->
      <div v-if="projects.length === 0">
        <p class="mb-6 text-center text-lg">
          {{ $t('checkout.confirmProject.noProjectsFound') }}
        </p>
      </div>
      <div v-else>
        <p class="mb-2 text-center">
          {{ $t('checkout.confirmProject.message') }}
        </p>
        <p class="mb-6 text-center font-bold text-xl">
          {{ selectedProject.name }}
        </p>
      </div>

      <!-- Botões de ação -->
      <div class="flex flex-col gap-4">
        <button
          @click="confirmProject"
          class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black"
        >
          {{ projects.length === 0 ? $t('auth.close') : $t('checkout.confirmProject.confirm') }}
        </button>

        <button
          v-if="projects.length > 0"
          @click="showProjectSelector = true"
          class="w-full bg-white border border-gray-300 py-4 font-archivo-narrow font-semibold text-xl text-black"
        >
          {{ $t('checkout.confirmProject.changeProject') }}
        </button>
      </div>

      <!-- Seletor de projeto (aparece quando o usuário quer trocar) -->
      <div v-if="showProjectSelector" class="mt-6">
        <!-- Mensagem de carregamento -->
        <div v-if="isLoading" class="text-center mb-4">
          <p class="font-archivo text-lg">{{ $t('checkout.confirmProject.loadingProjects') }}</p>
        </div>

        <!-- Mensagem de erro -->
        <div v-else-if="error" class="text-center mb-4">
          <p class="font-archivo text-lg text-red-600">{{ error }}</p>
          <button
            @click="loadProjects"
            class="mt-2 bg-empire-yellow px-4 py-2 font-archivo-narrow font-semibold text-black"
          >
            {{ $t('checkout.confirmProject.retry') }}
          </button>
        </div>

        <!-- Mensagem de nenhum projeto encontrado -->
        <div v-else-if="projects.length === 0" class="text-center mb-4">
          <p class="font-archivo text-lg">{{ $t('checkout.confirmProject.noProjectsFound') }}</p>
        </div>

        <!-- Seletor de projetos -->
        <div v-else>
          <label for="project-select" class="block font-archivo text-lg mb-2">{{ $t('auth.project') }}</label>
          <select
            id="project-select"
            v-model="newProjectId"
            class="w-full p-4 border border-gray-300 focus:outline-none focus:border-empire-yellow mb-4"
          >
            <option value="" disabled>{{ $t('auth.selectProjectPlaceholder') }}</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name || project.nome }}
            </option>
          </select>

          <button
            @click="changeProject"
            :disabled="!newProjectId || newProjectId === selectedProject.id"
            class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black disabled:opacity-50"
          >
            {{ $t('checkout.confirmProject.applyChange') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { projectService } from '@/services/projectService'

export default {
  name: 'ProjectConfirmationModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm', 'change-project'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const showProjectSelector = ref(false)
    const newProjectId = ref('')
    const isLoading = ref(false)
    const error = ref('')

    // Usa reactive para o projeto selecionado para permitir atualização direta
    const selectedProject = reactive({
      id: '',
      name: ''
    })

    // Carrega o projeto selecionado do sessionStorage quando o componente é montado
    const loadSelectedProject = () => {
      const storedProject = projectService.getSelectedProject()
      if (storedProject) {
        selectedProject.id = storedProject.id
        selectedProject.name = storedProject.name
      }
    }

    // Lista de projetos do usuário
    const projects = ref([])

    // Carrega os projetos do usuário
    const loadProjects = async () => {
      isLoading.value = true
      error.value = ''

      try {
        console.log('Buscando projetos para o usuário logado')

        // Busca os projetos do usuário logado usando o token JWT
        const userProjects = await projectService.getCurrentUserProjects()
        projects.value = userProjects
      } catch (err) {
        console.error('Erro ao carregar projetos:', err)
        error.value = t('checkout.confirmProject.loadError')
        projects.value = []
      } finally {
        isLoading.value = false
      }
    }

    // Inicializa o objeto selectedProject quando o componente é montado
    onMounted(() => {
      loadSelectedProject()
      loadProjects()
    })

    // Reseta o estado quando o modal é fechado e carrega o projeto quando é aberto
    watch(() => props.show, (newValue) => {
      if (newValue) {
        // Carrega o projeto selecionado quando o modal é aberto
        loadSelectedProject()
      } else {
        // Reseta o estado quando o modal é fechado
        showProjectSelector.value = false
        newProjectId.value = ''
      }
    })

    const closeModal = () => {
      // Se não houver projetos, remover qualquer projeto salvo no sessionStorage
      if (projects.value.length === 0) {
        console.log('Nenhum projeto encontrado, removendo projeto do sessionStorage')
        sessionStorage.removeItem('selectedProject')
      }
      emit('close')
    }

    const confirmProject = () => {
      // Se não houver projetos, remover qualquer projeto salvo no sessionStorage
      if (projects.value.length === 0) {
        console.log('Nenhum projeto encontrado, removendo projeto do sessionStorage')
        sessionStorage.removeItem('selectedProject')
        emit('close')
        return
      }
      emit('confirm', selectedProject)
    }

    const changeProject = () => {
      if (newProjectId.value && newProjectId.value !== selectedProject.id) {
        const project = projects.value.find(p => p.id === newProjectId.value)

        // Atualiza o objeto selectedProject diretamente
        selectedProject.id = project.id
        selectedProject.name = project.name || project.nome

        // Salva o novo projeto selecionado no sessionStorage
        projectService.saveSelectedProject({
          id: project.id,
          name: project.name || project.nome
        })

        emit('change-project', {
          id: project.id,
          name: project.name
        })

        // Atualiza a UI
        showProjectSelector.value = false
      }
    }

    return {
      showProjectSelector,
      newProjectId,
      selectedProject,
      projects,
      isLoading,
      error,
      closeModal,
      confirmProject,
      changeProject,
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
