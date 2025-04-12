<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="font-archivo-narrow font-semibold text-2xl mb-6 text-center">{{ $t('auth.selectProject') }}</h2>
      
      <!-- Combobox para seleção de projeto -->
      <div class="mb-6">
        <label for="project-select" class="block font-archivo text-lg mb-2">{{ $t('auth.project') }}</label>
        <select 
          id="project-select" 
          v-model="selectedProject" 
          class="w-full p-4 border border-gray-300 focus:outline-none focus:border-empire-yellow"
        >
          <option value="" disabled>{{ $t('auth.selectProjectPlaceholder') }}</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
      
      <!-- Botão de confirmação -->
      <button 
        @click="confirmSelection" 
        :disabled="!selectedProject"
        class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-xl text-black disabled:opacity-50"
      >
        {{ $t('auth.confirm') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
    const selectedProject = ref('')
    
    // Mock de projetos - será substituído por dados reais posteriormente
    const projects = [
      { id: '1', name: 'Projeto A' },
      { id: '2', name: 'Projeto B' },
      { id: '3', name: 'Projeto C' },
      { id: '4', name: 'Projeto D' },
      { id: '5', name: 'Projeto E' }
    ]
    
    const closeModal = () => {
      emit('close')
    }
    
    const confirmSelection = () => {
      if (selectedProject.value) {
        const project = projects.find(p => p.id === selectedProject.value)
        emit('project-selected', { 
          projectId: selectedProject.value, 
          projectName: project.name,
          redirectPath: props.redirectPath
        })
      }
    }
    
    return {
      selectedProject,
      projects,
      closeModal,
      confirmSelection,
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
