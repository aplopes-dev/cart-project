<template>
  <div class="company-history">
    <h2>Company History</h2>
    
    <!-- Form for adding/editing history -->
    <form @submit.prevent="handleSubmit" class="history-form">
      <div class="form-group">
        <label for="year">Year</label>
        <input 
          type="number" 
          id="year" 
          v-model="formData.year" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          type="text" 
          id="title" 
          v-model="formData.title" 
          required
        >
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="formData.description" 
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="image">Image URL</label>
        <input 
          type="text" 
          id="image" 
          v-model="formData.image_url"
        >
      </div>
      
      <button type="submit">
        {{ editingId ? 'Update' : 'Add' }} History
      </button>
      
      <button 
        v-if="editingId" 
        type="button" 
        @click="cancelEdit"
      >
        Cancel
      </button>
    </form>

    <!-- History Timeline -->
    <div class="history-timeline">
      <div 
        v-for="item in sortedHistory" 
        :key="item.id" 
        class="history-item"
      >
        <div class="year">{{ item.year }}</div>
        <div class="content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <img 
            v-if="item.image_url" 
            :src="item.image_url" 
            :alt="item.title"
          >
          <div class="actions">
            <button @click="editItem(item)">Edit</button>
            <button @click="deleteItem(item.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { settingsService } from '@/services/settingsService'
import { useToast } from 'vue-toastification'

const toast = useToast()
const history = ref([])
const editingId = ref(null)
const formData = ref({
  year: new Date().getFullYear(),
  title: '',
  description: '',
  image_url: ''
})

const sortedHistory = computed(() => {
  return [...history.value].sort((a, b) => a.year - b.year)
})

const fetchHistory = async () => {
  try {
    history.value = await settingsService.getHistory()
  } catch (error) {
    toast.error('Failed to load history')
  }
}

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await settingsService.updateHistory(editingId.value, formData.value)
      toast.success('History updated successfully')
    } else {
      await settingsService.addHistory(formData.value)
      toast.success('History added successfully')
    }
    
    await fetchHistory()
    resetForm()
  } catch (error) {
    toast.error('Failed to save history')
  }
}

const editItem = (item) => {
  editingId.value = item.id
  formData.value = { ...item }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this history item?')) return
  
  try {
    await settingsService.deleteHistory(id)
    await fetchHistory()
    toast.success('History deleted successfully')
  } catch (error) {
    toast.error('Failed to delete history')
  }
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  editingId.value = null
  formData.value = {
    year: new Date().getFullYear(),
    title: '',
    description: '',
    image_url: ''
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.company-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.history-form {
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.history-timeline {
  position: relative;
}

.history-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.year {
  flex: 0 0 100px;
  font-weight: bold;
  font-size: 1.2em;
}

.content {
  flex: 1;
  padding: 0 20px;
  border-left: 2px solid #ddd;
}

.content img {
  max-width: 300px;
  margin-top: 10px;
  border-radius: 4px;
}

.actions {
  margin-top: 10px;
}

.actions button {
  margin-right: 10px;
}
</style>