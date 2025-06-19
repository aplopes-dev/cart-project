<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      :class="[
        'w-full p-2 md:p-4 border-2 rounded font-archivo text-sm md:text-base bg-white appearance-none cursor-pointer transition-all duration-200',
        error ? 'border-red-500 focus:border-red-600' : 'border-black/25 focus:border-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-black/40',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
      ]"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <!-- Custom dropdown arrow -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg 
        class="w-4 h-4 text-gray-600" 
        :class="{ 'text-gray-400': disabled }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <!-- Error message -->
    <span v-if="error && errorMessage" class="text-red-500 text-sm mt-1 block">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Selecione uma opção'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  watch: {
    modelValue(newValue) {
      this.$emit('change', newValue);
    }
  }
}
</script>

<style scoped>
/* Remove default select styling */
select {
  background-image: none;
}

/* Focus styles */
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Disabled state */
select:disabled {
  background-color: #f9fafb;
}
</style>
