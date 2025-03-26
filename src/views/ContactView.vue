<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">{{ $t('contact.title') }}</h1>

      <div class="grid md:grid-cols-2 gap-12">
        <!-- Informações de Contato -->
        <div class="bg-[#FAFAFA] p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-6">{{ $t('contact.info.title') }}</h2>
          
          <div class="space-y-6">
            <!-- Telefone -->
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-empire-yellow rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <span class="font-archivo text-lg">514 745-1080</span>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-empire-yellow rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </div>
              <span class="font-archivo text-lg">info@empirecanada.ca</span>
            </div>

            <!-- Endereço -->
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-empire-yellow rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span class="font-archivo text-lg">2320, rue Cohen, Saint-Laurent, QC H4R 2N8</span>
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'ContactView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      resumeFile: null,
      selectedFileName: '',
      showErrors: false
    }
  },
  created() {
    if (this.$route.query.subject === 'job_application') {
      this.formData.subject = 'job_application'
      if (this.$route.query.position) {
        this.formData.message = `I would like to apply for the position of ${this.$route.query.position}`
      }
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        // Verificar o tipo e tamanho do arquivo
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (!allowedTypes.includes(file.type)) {
          alert(this.$t('contact.form.invalidFileType'))
          this.$refs.resumeInput.value = ''
          this.resumeFile = null
          this.selectedFileName = ''
          return
        }

        if (file.size > maxSize) {
          alert(this.$t('contact.form.fileTooLarge'))
          this.$refs.resumeInput.value = ''
          this.resumeFile = null
          this.selectedFileName = ''
          return
        }

        this.resumeFile = file
        this.selectedFileName = file.name
      } else {
        this.resumeFile = null
        this.selectedFileName = ''
      }
    },
    async handleSubmit() {
      this.showErrors = true

      // Validar se o currículo foi anexado para candidaturas
      if (this.formData.subject === 'job_application' && !this.resumeFile) {
        return
      }

      // Criar FormData para enviar arquivo
      const formData = new FormData()
      formData.append('name', this.formData.name)
      formData.append('email', this.formData.email)
      formData.append('phone', this.formData.phone)
      formData.append('subject', this.formData.subject)
      formData.append('message', this.formData.message)
      
      if (this.resumeFile) {
        formData.append('resume', this.resumeFile)
      }

      try {
        // Enviar para a API
        await axios.post('/api/contact', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Limpar formulário após envio
        this.formData = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
        this.resumeFile = null
        this.selectedFileName = ''
        this.$refs.resumeInput.value = ''
        this.showErrors = false

        // Mostrar mensagem de sucesso
        alert(this.$t('contact.form.submitSuccess'))
      } catch (error) {
        console.error('Error submitting form:', error)
        alert(this.$t('contact.form.submitError'))
      }
    }
  }
}
</script>

