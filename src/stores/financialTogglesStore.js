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
      this.fieldToggles[field] = value
    },

    setMasterToggle(value) {
      this.masterToggle = value
    },

    // Método para definir todos os toggles sem alterar o masterToggle
    setAllTogglesOnly(value) {
      // Cria um novo objeto para garantir a reatividade
      const newToggles = {}
      Object.keys(this.fieldToggles).forEach(key => {
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
