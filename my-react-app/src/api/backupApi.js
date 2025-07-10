import api from './axios.js'

export const backupApi = {
  // Create database backup
  createBackup: async () => {
    try {
      const response = await api.post('/backup')
      return response.data
    } catch (error) {
      console.error('Error creating backup:', error)
      throw error
    }
  },

  // Restore database from backup
  restoreBackup: async () => {
    try {
      const response = await api.post('/restore')
      return response.data
    } catch (error) {
      console.error('Error restoring backup:', error)
      throw error
    }
  },

  // Get backup info
  getBackupInfo: async () => {
    try {
      const response = await api.get('/backup/info')
      return response.data
    } catch (error) {
      console.error('Error getting backup info:', error)
      throw error
    }
  }
} 