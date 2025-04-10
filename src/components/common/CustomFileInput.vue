<template>
  <div class="custom-file-input">
    <input
      type="file"
      ref="fileInput"
      :accept="accept"
      @change="handleFileChange"
      class="hidden"
    />
    <div class="flex items-center gap-3">
      <button
        type="button"
        @click="triggerFileInput"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
      >
        {{ $t('fileInput.chooseFile') }}
      </button>
      <span class="text-gray-600">
        {{ selectedFileName || $t('fileInput.noFileChosen') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
  accept: {
    type: String,
    default: 'image/*'
  }
})

const emit = defineEmits(['file-selected'])

const fileInput = ref(null)
const selectedFileName = ref('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    emit('file-selected', file)
  } else {
    selectedFileName.value = ''
    emit('file-selected', null)
  }
}
</script>

<style scoped>
.custom-file-input input[type="file"] {
  display: none;
}
</style>
