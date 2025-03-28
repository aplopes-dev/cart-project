<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-[1408px] mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else class="grid md:grid-cols-2 gap-12">
          <!-- Informações de Contato -->
          <div class="space-y-6">
            <!-- Título da Página -->
            <h1 class="font-archivo-narrow text-4xl font-bold mb-8">{{ $t('contact.title') }}</h1>

            <!-- Card do Contato Principal -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <!-- Barra superior decorativa -->
              <div class="h-2 bg-empire-yellow rounded-t-xl"></div>
              
              <div class="p-6">
                <!-- Nome da Empresa -->
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-10 h-10 bg-empire-yellow rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <span class="font-archivo text-xl font-semibold">{{ companyData.name }}</span>
                </div>

                <div class="space-y-4">
                  <!-- Telefone Principal -->
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </div>
                    <a :href="`tel:${companyData.phone}`" class="font-archivo text-lg hover:text-empire-yellow transition-colors">
                      {{ companyData.phone }}
                    </a>
                  </div>

                  <!-- Email Principal -->
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <a :href="`mailto:${companyData.email}`" class="font-archivo text-lg hover:text-empire-yellow transition-colors">
                      {{ companyData.email }}
                    </a>
                  </div>

                  <!-- Endereço Principal -->
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <span class="font-archivo text-lg">{{ companyData.address }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cards dos Contatos Adicionais -->
            <div v-if="contacts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="contact in contacts" 
                :key="contact.id"
                class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <!-- Barra superior decorativa -->
                <div class="h-2 bg-empire-yellow rounded-t-xl"></div>
                
                <div class="p-6">
                  <!-- Nome e Departamento -->
                  <div class="flex items-center gap-4 mb-6">
                    <div class="w-10 h-10 bg-empire-yellow rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div>
                      <span class="font-archivo text-xl font-semibold block">{{ contact.name }}</span>
                      <span class="text-gray-600 text-sm">{{ contact.department }}</span>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <!-- Telefone -->
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                      </div>
                      <a :href="`tel:${contact.phone}`" class="font-archivo text-lg hover:text-empire-yellow transition-colors">
                        {{ contact.phone }}
                      </a>
                    </div>

                    <!-- Email -->
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <a :href="`mailto:${contact.email}`" class="font-archivo text-lg hover:text-empire-yellow transition-colors">
                        {{ contact.email }}
                      </a>
                    </div>

                    <!-- Endereço -->
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-empire-yellow/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <span class="font-archivo text-lg">{{ contact.address }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulário de Contato -->
          <div class="bg-[#FAFAFA] p-8 rounded-lg">
            <h2 class="font-archivo-narrow text-2xl text-black mb-6">{{ $t('contact.form.title') }}</h2>
          
            <form @submit.prevent="handleSubmit" class="space-y-6" enctype="multipart/form-data">
              <!-- Nome -->
              <div>
                <label class="block font-archivo text-sm mb-2" for="name">
                  {{ $t('contact.form.name') }}
                </label>
                <input 
                  type="text" 
                  id="name"
                  v-model="formData.name"
                  class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                  required
                >
              </div>

              <!-- Email -->
              <div>
                <label class="block font-archivo text-sm mb-2" for="email">
                  {{ $t('contact.form.email') }}
                </label>
                <input 
                  type="email" 
                  id="email"
                  v-model="formData.email"
                  class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                  required
                >
              </div>

              <!-- Telefone -->
              <div>
                <label class="block font-archivo text-sm mb-2" for="phone">
                  {{ $t('contact.form.phone') }}
                </label>
                <input 
                  type="tel" 
                  id="phone"
                  v-model="formData.phone"
                  class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                >
              </div>

              <!-- Assunto -->
              <div>
                <label class="block font-archivo text-sm mb-2" for="subject">
                  {{ $t('contact.form.subject') }}
                </label>
                <select 
                  id="subject"
                  v-model="formData.subject"
                  class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                  required
                >
                  <option value="">{{ $t('contact.form.selectSubject') }}</option>
                  <option value="general">{{ $t('contact.form.subjects.general') }}</option>
                  <option value="support">{{ $t('contact.form.subjects.support') }}</option>
                  <option value="sales">{{ $t('contact.form.subjects.sales') }}</option>
                  <option value="job_application">{{ $t('contact.form.subjects.jobApplication') }}</option>
                  <option value="other">{{ $t('contact.form.subjects.other') }}</option>
                </select>
              </div>

              <!-- Mensagem -->
              <div>
                <label class="block font-archivo text-sm mb-2" for="message">
                  {{ $t('contact.form.message') }}
                </label>
                <textarea 
                  id="message"
                  v-model="formData.message"
                  rows="4"
                  class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                  required
                ></textarea>
              </div>

              <!-- Campo de upload de currículo - mostrado apenas para job applications -->
              <div v-if="formData.subject === 'job_application'">
                <label class="block font-archivo text-sm mb-2" for="resume">
                  {{ $t('contact.form.resume') }} *
                </label>
                <div class="flex items-center gap-2">
                  <input 
                    type="file"
                    id="resume"
                    ref="resumeInput"
                    @change="handleFileChange"
                    accept=".pdf,.doc,.docx"
                    class="hidden"
                  >
                  <button 
                    type="button"
                    @click="$refs.resumeInput.click()"
                    class="px-4 py-2 border-2 border-black/25 rounded font-archivo text-base hover:border-empire-yellow focus:outline-none focus:border-empire-yellow"
                  >
                    {{ $t('contact.form.chooseFile') }}
                  </button>
                  <span class="text-sm text-gray-600">
                    {{ selectedFileName || $t('contact.form.noFileChosen') }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  {{ $t('contact.form.acceptedFormats') }}
                </p>
                <span v-if="showErrors && formData.subject === 'job_application' && !resumeFile" class="text-red-500 text-sm mt-1">
                  {{ $t('contact.form.resumeRequired') }}
                </span>
              </div>

              <!-- Botão de Envio -->
              <button 
                type="submit"
                class="w-full bg-empire-yellow text-black font-archivo-narrow font-semibold text-xl py-4 rounded hover:bg-empire-yellow/90 transition-colors"
              >
                {{ $t('contact.form.submit') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCurrentInstance } from 'vue'
import api from '@/services/api'

const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const loading = ref(false)
const companyData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})
const contacts = ref([])

// Carrega os dados da empresa e contatos
const loadCompanyData = async () => {
  loading.value = true
  try {
    const response = await api.get('/settings/company')
    companyData.value = {
      name: response.data.company_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      address: response.data.address || ''
    }
    // Mapeia os contatos para o formato correto
    contacts.value = (response.data.contacts || []).map(contact => ({
      id: contact.id,
      name: contact.name,
      department: contact.department,
      email: contact.email,
      phone: contact.phone,
      address: contact.address // Garantindo que o endereço está sendo mapeado
    }))
  } catch (err) {
    console.error('Error loading company data:', err)
    toast.error(t('contact.loadError'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCompanyData()
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})
const resumeFile = ref(null)
const selectedFileName = ref('')
const showErrors = ref(false)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Verificar o tipo e tamanho do arquivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert(t('contact.form.invalidFileType'))
      event.target.value = ''
      resumeFile.value = null
      selectedFileName.value = ''
      return
    }

    if (file.size > maxSize) {
      alert(t('contact.form.fileTooLarge'))
      event.target.value = ''
      resumeFile.value = null
      selectedFileName.value = ''
      return
    }

    resumeFile.value = file
    selectedFileName.value = file.name
  } else {
    resumeFile.value = null
    selectedFileName.value = ''
  }
}

const handleSubmit = async () => {
  showErrors.value = true

  // Validar se o currículo foi anexado para candidaturas
  if (formData.value.subject === 'job_application' && !resumeFile.value) {
    return
  }

  // Criar FormData para enviar arquivo
  const formDataToSend = new FormData()
  formDataToSend.append('name', formData.value.name)
  formDataToSend.append('email', formData.value.email)
  formDataToSend.append('phone', formData.value.phone)
  formDataToSend.append('subject', formData.value.subject)
  formDataToSend.append('message', formData.value.message)
  
  if (resumeFile.value) {
    formDataToSend.append('resume', resumeFile.value)
  }

  try {
    // Enviar para a API
    await api.post('/api/contact', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Limpar formulário após envio
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    resumeFile.value = null
    selectedFileName.value = ''
    event.target.value = ''
    showErrors.value = false

    // Mostrar mensagem de sucesso
    alert(t('contact.form.submitSuccess'))
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(t('contact.form.submitError'))
  }
}
</script>

