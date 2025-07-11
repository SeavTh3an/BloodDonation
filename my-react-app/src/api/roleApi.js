import api from './axios.js'

export const roleApi = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles')
      return response.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  },

  // Create a new role
  createRole: async (roleName) => {
    try {
      const response = await api.post('/roles', { roleName })
      return response.data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  },

  // Delete a role
  deleteRole: async (roleName) => {
    try {
      const response = await api.delete(`/roles/${roleName}`)
      return response.data
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  },

  // Grant permissions to a role
  grantPermissions: async (roleName, { permissions, entity }) => {
    try {
      const response = await api.post('/roles/permissions/grant', {
        roleName,
        permissions,
        entity
      })
      return response.data
    } catch (error) {
      console.error('Error granting permissions:', error)
      throw error
    }
  },

  // Revoke permissions from a role
  revokePermissions: async (roleName, permissions) => {
    try {
      const response = await api.post('/roles/permissions/revoke', {
        roleName,
        permissions
      })
      return response.data
    } catch (error) {
      console.error('Error revoking permissions:', error)
      throw error
    }
  },

  // Assign role to user
  assignRoleToUser: async (roleName, userName) => {
    try {
      const response = await api.post('/roles/assign', {
        roleName,
        userName
      })
      return response.data
    } catch (error) {
      console.error('Error assigning role to user:', error)
      throw error
    }
  },

  // Get user roles (this would need to be implemented in the backend)
  getUserRoles: async (userName) => {
    try {
      const response = await api.get(`/roles/user/${userName}`)
      return response.data
    } catch (error) {
      console.error('Error getting user roles:', error)
      throw error
    }
  },

  // Get role permissions
  getRolePermissions: async (roleName) => {
    try {
      const response = await api.get(`/roles/${roleName}/permissions`)
      return response.data
    } catch (error) {
      console.error('Error getting role permissions:', error)
      throw error
    }
  },

  // Get users with a specific role
  getUsersWithRole: async (roleName) => {
    try {
      const response = await api.get(`/roles/${roleName}/users`)
      return response.data
    } catch (error) {
      console.error('Error getting users with role:', error)
      throw error
    }
  },

  // Revoke role from all users
  revokeRoleFromAllUsers: async (roleName) => {
    try {
      const response = await api.post(`/roles/${roleName}/revoke-all`)
      return response.data
    } catch (error) {
      console.error('Error revoking role from all users:', error)
      throw error
    }
  },

  // Revoke role from user
  revokeRoleFromUser: async (roleName, userName) => {
    try {
      const response = await api.post('/roles/revoke', { roleName, userName })
      return response.data
    } catch (error) {
      console.error('Error revoking role from user:', error)
      throw error
    }
  }
} 