import api from './axios.js'

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Create a new user
  createUser: async (user, password) => {
    try {
      const response = await api.post('/users', { user, password })
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Delete a user
  deleteUser: async (user) => {
    try {
      const response = await api.delete(`/users/${user}`)
      return response.data
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Update user status (active/inactive)
  updateUserStatus: async (user, status) => {
    try {
      const response = await api.put(`/users/${user}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  }
} 