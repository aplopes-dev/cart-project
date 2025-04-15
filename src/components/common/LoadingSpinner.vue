<template>
  <div class="loading-spinner-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ text || $t('common.loading') }}...</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    text: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
}

.loading-spinner {
  border: 4px solid rgba(251, 189, 30, 0.3);
  border-top: 4px solid #FBBD1E;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
