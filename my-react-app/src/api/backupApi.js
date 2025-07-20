import api from './axios.js'

export const BackupType = {
  FULL: 'FULL'
}

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

  // Get backup info
  getBackupInfo: async (fileName) => {
    try {
      const url = fileName ? `/backup/${encodeURIComponent(fileName)}` : '/backup/info'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error('Error getting backup info:', error)
      throw error
    }
  },

  // Get all backups
  getAllBackups: async () => {
    try {
      const response = await api.get('/backup/all')
      return response.data
    } catch (error) {
      console.error('Error getting all backups:', error)
      throw error
    }
  },

  // Get current database info
  getCurrentDatabaseInfo: async () => {
    try {
      const response = await api.get('/database/info')
      return response.data
    } catch (error) {
      console.error('Error getting current database info:', error)
      throw error
    }
  }
} 