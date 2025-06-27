<template>
  <div class="login-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[36px] md:leading-[40px]">{{ $t('auth.signIn') }}</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="flex flex-col justify-center items-center px-4 gap-4 md:gap-6 py-4 md:py-8">
          <div class="flex flex-col justify-center items-center p-6 md:p-16 gap-3 md:gap-4 w-full max-w-[754px] bg-[#FAFAFA]">
            <!-- Sign Up Text - Oculto temporariamente, mas mantido para uso futuro -->
            <!--
            <p class="w-full font-archivo text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-center text-[#1E1E1E]">
              {{ $t('auth.dontHaveAccount') }}
              <a
                @click.prevent="goToSignup"
                href="#"
                class="text-empire-yellow hover:underline cursor-pointer"
              >
                {{ $t('auth.signUpFree') }}
              </a>
            </p>
            -->

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-3 md:gap-4">
              <!-- Username Input -->
              <input
                v-model="email"
                type="text"
                :placeholder="$t('auth.usernamePlaceholder')"
                class="w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300"
              />

              <!-- Password Input -->
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.password')"
                  class="w-full p-2 md:p-4 h-10 md:h-auto text-sm md:text-base border border-gray-300"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <svg
                    v-if="showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>

              <!-- Error Message -->
              <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

              <!-- Forgot Password -->
              <router-link
                to="/forgot-password"
                class="w-full font-archivo text-[16px] md:text-[20px] leading-[24px] md:leading-[30px] text-center text-[#1E1E1E] hover:text-empire-yellow"
              >
                {{ $t('auth.forgotPassword') }}
              </router-link>

              <!-- Sign In Button -->
              <div class="w-full mt-2 md:mt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full bg-empire-yellow py-2 md:py-4 flex justify-center items-center"
                >
                  <span class="font-archivo-narrow font-semibold text-base md:text-[28px] leading-normal md:leading-[72px] text-black">
                    {{ isLoading ? $t('auth.loading') : $t('auth.signIn') }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Projeto -->
    <ProjectSelectionModal
      :show="showProjectModal"
      :redirect-path="redirectPath"
      @close="closeProjectModal"
      @project-selected="handleProjectSelected"
    />


  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { projectService } from '@/services/projectService'
import ProjectSelectionModal from '@/components/auth/ProjectSelectionModal.vue'

export default {
  name: 'LoginPage',
  components: {
    ProjectSelectionModal
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const app = getCurrentInstance()
    const toast = app.appContext.config.globalProperties.$toast
    const cartStore = useCartStore()

    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)
    const showProjectModal = ref(false)
    const redirectPath = ref('')

    const handleLogin = async () => {
      try {
        isLoading.value = true
        error.value = ''

        // Login
        await store.dispatch('login', {
          email: email.value,
          password: password.value
        })

        await store.dispatch('updateUser')
        await nextTick()

        // Carrega o carrinho após login bem-sucedido
        const userId = store.state.currentUser?.id
        const userProfile = store.state.currentUser?.profile || 'USER'
        console.log('Login successful, userId:', userId, 'userProfile:', userProfile)

        if (userId) {
          console.log('Loading cart for user:', userId)
          try {
            // Busca dados do carrinho do banco e salva no localStorage
            await cartStore.loadCartFromStorage(userId)
            console.log('Cart loaded from database:', cartStore.items)
          } catch (cartError) {
            console.error('Error loading cart:', cartError)
          }
        }

        // Salva o caminho de redirecionamento
        redirectPath.value = route.query.redirect || '/'

        // Verifica se o usuário é admin ou tem apenas um projeto
        if (userProfile === 'ADMIN') {
          console.log('Usuário é admin, redirecionando diretamente sem mostrar modal de projetos')
          router.push({ path: redirectPath.value, replace: true })
          return
        }

        // Para usuários não-admin, verifica a quantidade de projetos
        try {
          const userProjects = await projectService.getCurrentUserProjects()
          console.log('Projetos do usuário:', userProjects)

          if (userProjects.length === 0) {
            // Se não tiver projetos, permite acesso ao sistema sem modal
            console.log('Usuário não tem projetos, permitindo acesso ao sistema')
            router.push({ path: redirectPath.value, replace: true })
            return
          } else if (userProjects.length === 1) {
            console.log('Usuário tem apenas um projeto, selecionando automaticamente:', userProjects[0])

            // Salva o projeto no sessionStorage
            const projectData = {
              id: userProjects[0].id,
              name: userProjects[0].name || userProjects[0].nome
            }

            projectService.saveSelectedProject(projectData)
            console.log('Projeto salvo no sessionStorage:', projectData)

            // Redireciona diretamente
            router.push({ path: redirectPath.value, replace: true })
            return
          } else if (userProjects.length > 1) {
            // Se tiver mais de um projeto, mostra o modal de seleção
            console.log('Usuário tem múltiplos projetos, exibindo modal de seleção')
            showProjectModal.value = true
            console.log('Estado do modal de seleção de projeto:', showProjectModal.value)
          }
        } catch (projectError) {
          console.error('Erro ao buscar projetos do usuário:', projectError)
          // Em caso de erro, mostra o modal para garantir que o usuário possa selecionar um projeto
          showProjectModal.value = true
        }

      } catch (err) {
        console.error('Login error:', err)
        const errorMessage = err.response?.data?.message === 'Invalid credentials'
          ? t('auth.invalidCredentials')
          : t('auth.loginError')

        error.value = errorMessage
        toast.error(errorMessage)
      } finally {
        isLoading.value = false
      }
    }

    const closeProjectModal = () => {
      showProjectModal.value = false
      // Se o usuário fechar o modal sem selecionar um projeto, redireciona para a página inicial
      router.push({ path: redirectPath.value, replace: true })
    }



    const handleProjectSelected = async (data) => {
      showProjectModal.value = false
      console.log('Projeto selecionado:', data.projectId, data.projectName)

      try {
        // Importa o serviço de projeto de forma síncrona
        const module = await import('@/services/projectService');
        const projectService = module.projectService;

        // Cria o objeto de projeto
        const projectData = {
          id: data.projectId,
          name: data.projectName
        };

        // Salva o projeto no sessionStorage
        // O serviço irá emitir o evento 'selected-project-changed'
        projectService.saveSelectedProject(projectData);
        console.log('Projeto salvo no sessionStorage:', data.projectId, data.projectName);

        // Aguarda um pequeno intervalo para garantir que o evento seja processado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redireciona para o caminho original
        router.push({ path: data.redirectPath, replace: true });
      } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        // Redireciona mesmo em caso de erro
        router.push({ path: data.redirectPath, replace: true });
      }
    }

    // Método temporariamente desativado, mas mantido para uso futuro
    const goToSignup = () => {
      const query = route.query.redirect ? { redirect: route.query.redirect } : {}
      router.push({
        path: '/signup',
        query
      })
    }

    // Verificação de segurança ao montar o componente
    onMounted(async () => {
      // Se o usuário já estiver logado, não precisa fazer verificação de projetos
      // pois agora permitimos acesso mesmo sem projetos
      console.log('LoginPage montado - usuário pode acessar independente de ter projetos')
    })

    return {
      email,
      password,
      error,
      isLoading,
      showPassword,
      showProjectModal,
      redirectPath,
      handleLogin,
      closeProjectModal,
      handleProjectSelected,
      goToSignup,
      t
    }
  }
}
</script>

<style scoped>
.login-page input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.login-page input:focus {
  outline: none;
  border-color: #FFDD00;
}

/* Estilos específicos para mobile */
@media (max-width: 768px) {
  .login-page input {
    font-size: 14px;
  }

  .login-page button svg {
    width: 18px;
    height: 18px;
  }
}
</style>

















