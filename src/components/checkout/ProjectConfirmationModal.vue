<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="font-archivo-narrow font-semibold text-2xl mb-6 text-center">{{ $t('checkout.confirmProject.title') }}</h2>

      <!-- Mensagem de confirmação -->
      <p class="mb-2 text-center">
        {{ $t('checkout.confirmProject.message') }}
      </p>
      <p class="mb-6 text-center font-bold text-xl">
        {{ selectedProject.name }}
      </p>

      <!-- Botões de ação -->
      <div class="flex flex-col gap-4">
        <button
          @click="confirmProject"
          class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black"
        >
          {{ $t('checkout.confirmProject.confirm') }}
        </button>

        <button
          @click="showProjectSelector = true"
          class="w-full bg-white border border-gray-300 py-4 font-archivo-narrow font-semibold text-xl text-black"
        >
          {{ $t('checkout.confirmProject.changeProject') }}
        </button>
      </div>

      <!-- Seletor de projeto (aparece quando o usuário quer trocar) -->
      <div v-if="showProjectSelector" class="mt-6">
        <label for="project-select" class="block font-archivo text-lg mb-2">{{ $t('auth.project') }}</label>
        <select
          id="project-select"
          v-model="newProjectId"
          class="w-full p-4 border border-gray-300 focus:outline-none focus:border-empire-yellow mb-4"
        >
          <option value="" disabled>{{ $t('auth.selectProjectPlaceholder') }}</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
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
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

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

    // Usa reactive para o projeto selecionado para permitir atualização direta
    const selectedProject = reactive({
      id: '',
      name: ''
    })

    // Carrega o projeto selecionado do localStorage quando o componente é montado
    const loadSelectedProject = () => {
      const storedProject = localStorage.getItem('selectedProject')
      if (storedProject) {
        const parsed = JSON.parse(storedProject)
        selectedProject.id = parsed.id
        selectedProject.name = parsed.name
      }
    }

    // Mock de projetos - será substituído por dados reais posteriormente
    const projects = [
      { id: '1', name: 'Projeto A' },
      { id: '2', name: 'Projeto B' },
      { id: '3', name: 'Projeto C' },
      { id: '4', name: 'Projeto D' },
      { id: '5', name: 'Projeto E' }
    ]

    // Inicializa o objeto selectedProject quando o componente é montado
    onMounted(() => {
      loadSelectedProject()
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
      emit('close')
    }

    const confirmProject = () => {
      emit('confirm', selectedProject)
    }

    const changeProject = () => {
      if (newProjectId.value && newProjectId.value !== selectedProject.id) {
        const project = projects.find(p => p.id === newProjectId.value)

        // Atualiza o objeto selectedProject diretamente
        selectedProject.id = project.id
        selectedProject.name = project.name

        // Salva o novo projeto selecionado no localStorage
        localStorage.setItem('selectedProject', JSON.stringify({
          id: project.id,
          name: project.name
        }))

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
      closeModal,
      confirmProject,
      changeProject,
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
