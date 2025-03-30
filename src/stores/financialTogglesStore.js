import { defineStore } from 'pinia'

export const useFinancialTogglesStore = defineStore('financialToggles', {
  state: () => ({
    fieldToggles: {
      currency_code: true,
      currency_symbol: true,
      tax_rate: true,
      discount_percentage: true,
      min_order_value: true,
      free_shipping_threshold: true,
      shipping_cost: true
    },
    masterToggle: true,
    // Armazena o estado original dos toggles para usuários MANAGER
    readOnlyToggles: {
      currency_code: true,
      currency_symbol: true,
      tax_rate: true,
      discount_percentage: true,
      min_order_value: true,
      free_shipping_threshold: true,
      shipping_cost: true,
      masterToggle: true
    }
  }),

  actions: {
    setFieldToggle(field, value) {
      // Regra 1: Se estiver habilitando qualquer toggle individual, o master toggle também deve ser habilitado
      if (value === true) {
        this.masterToggle = true

        // Regra 2: Se estiver habilitando qualquer toggle individual, currency_code e currency_symbol também devem ser habilitados
        this.fieldToggles.currency_code = true
        this.fieldToggles.currency_symbol = true
      }

      // Regra 3: Se estiver desabilitando currency_code ou currency_symbol, ambos devem ser desabilitados e o master toggle também
      if ((field === 'currency_code' || field === 'currency_symbol') && value === false) {
        this.fieldToggles.currency_code = false
        this.fieldToggles.currency_symbol = false

        // Desabilita o master toggle, o que por sua vez desabilitará todos os outros toggles individuais
        this.setMasterToggle(false)
      } else {
        // Para outros campos, apenas atualiza o valor normalmente
        this.fieldToggles[field] = value
      }

      // Regra 4: Se todos os toggles individuais estiverem desabilitados, o master toggle também deve ser desabilitado
      if (Object.values(this.fieldToggles).every(toggle => toggle === false)) {
        this.masterToggle = false
      }
    },

    setMasterToggle(value) {
      this.masterToggle = value

      // Regra 1: Se o master toggle estiver sendo habilitado, todos os toggles individuais devem ser habilitados
      if (value === true) {
        this.setAllTogglesOnly(true)
      }

      // Regra 2: Se o master toggle estiver sendo desabilitado, todos os toggles individuais devem ser desabilitados
      if (value === false) {
        this.setAllTogglesOnly(false)
      }
    },

    // Método para definir todos os toggles sem alterar o masterToggle
    setAllTogglesOnly(value) {
      // Cria um novo objeto para garantir a reatividade
      const newToggles = {}
      Object.keys(this.fieldToggles).forEach(key => {
        // Se o valor for true, todos os toggles são habilitados
        // Se o valor for false, todos os toggles são desabilitados
        newToggles[key] = value
      })
      // Atualiza todos os toggles de uma vez
      this.fieldToggles = newToggles
    },

    // Método original que define todos os toggles e o masterToggle
    setAllToggles(value) {
      this.setAllTogglesOnly(value)
      this.masterToggle = value
    },

    // Atualiza o masterToggle com base no estado dos toggles individuais
    updateMasterToggleState() {
      // Verifica diretamente se todos os toggles estão desabilitados
      const allDisabled = Object.values(this.fieldToggles).every(value => value === false)

      if (allDisabled) {
        console.log('All toggles are disabled, setting master toggle to false')
        this.masterToggle = false
      } else {
        // Se pelo menos um toggle estiver habilitado, o masterToggle deve estar habilitado
        console.log('Some toggles are enabled, setting master toggle to true')
        this.masterToggle = true
      }
    },

    loadTogglesFromBackend(data) {
      // Atualizar os toggles com base nos dados do backend
      if (data) {
        // Atualizar os toggles individuais
        if (data.currency_code_enabled !== undefined) this.fieldToggles.currency_code = data.currency_code_enabled
        if (data.currency_symbol_enabled !== undefined) this.fieldToggles.currency_symbol = data.currency_symbol_enabled
        if (data.tax_rate_enabled !== undefined) this.fieldToggles.tax_rate = data.tax_rate_enabled
        if (data.discount_percentage_enabled !== undefined) this.fieldToggles.discount_percentage = data.discount_percentage_enabled
        if (data.min_order_value_enabled !== undefined) this.fieldToggles.min_order_value = data.min_order_value_enabled
        if (data.free_shipping_threshold_enabled !== undefined) this.fieldToggles.free_shipping_threshold = data.free_shipping_threshold_enabled
        if (data.shipping_cost_enabled !== undefined) this.fieldToggles.shipping_cost = data.shipping_cost_enabled

        // Atualizar o toggle principal
        if (data.master_toggle_enabled !== undefined) this.masterToggle = data.master_toggle_enabled

        // Salvar o estado original para usuários MANAGER
        this.saveReadOnlyState()
      }
    },

    saveReadOnlyState() {
      // Copia os estados dos toggles para a versão somente leitura
      Object.keys(this.fieldToggles).forEach(key => {
        this.readOnlyToggles[key] = this.fieldToggles[key]
      })
      this.readOnlyToggles.masterToggle = this.masterToggle
    },

    restoreReadOnlyState() {
      // Restaura os estados originais dos toggles para usuários MANAGER
      Object.keys(this.fieldToggles).forEach(key => {
        this.fieldToggles[key] = this.readOnlyToggles[key]
      })
      this.masterToggle = this.readOnlyToggles.masterToggle
    },

    prepareTogglesForSubmit() {
      // Prepara os dados dos toggles para enviar ao backend
      return {
        currency_code_enabled: this.fieldToggles.currency_code,
        currency_symbol_enabled: this.fieldToggles.currency_symbol,
        tax_rate_enabled: this.fieldToggles.tax_rate,
        discount_percentage_enabled: this.fieldToggles.discount_percentage,
        min_order_value_enabled: this.fieldToggles.min_order_value,
        free_shipping_threshold_enabled: this.fieldToggles.free_shipping_threshold,
        shipping_cost_enabled: this.fieldToggles.shipping_cost,
        master_toggle_enabled: this.masterToggle
      }
    }
  },

  getters: {
    isFieldEnabled: (state) => (field) => {
      return state.fieldToggles[field] || false
    },

    areAllEnabled: (state) => {
      return Object.values(state.fieldToggles).every(value => value === true)
    },

    areAllDisabled: (state) => {
      return Object.values(state.fieldToggles).every(value => value === false)
    },

    hasAnyEnabled: (state) => {
      return Object.values(state.fieldToggles).some(value => value === true)
    }
  }
})
