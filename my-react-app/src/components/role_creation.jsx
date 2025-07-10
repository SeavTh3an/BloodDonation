"use client"

import { useState, useEffect } from "react"
import { roleApi } from "../api/roleApi.js"
import RolePermissionsModal from "./role-permissions-modal.jsx"
import "../styles/role_creation.css"

const RoleManagement = () => {
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [selectedEntities, setSelectedEntities] = useState([])
  const [roles, setRoles] = useState([]) // Will be populated from backend
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)

  const permissions = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "TRIGGER", "ALL PRIVILEGES"]

  const entities = [
    "Appointment",
    "Blood",
    "Blood inventory",
    "Blood request",
    "Blood type",
    "Donation center",
    "Donation record",
    "Eligibility record",
    "Medical staff",
    "User",
  ]

  // Load roles from backend on component mount
  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      console.log('Loading roles...')
      const rolesData = await roleApi.getAllRoles()
      console.log('Roles data received:', rolesData)
      // Extract role names from the database response
      const roleNames = rolesData.map(role => role.rolname)
      console.log('Filtered role names:', roleNames)
      setRoles(roleNames)
    } catch (error) {
      console.error('Error loading roles:', error)
      setError(`Failed to load roles: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const toggleEntity = (entity) => {
    setSelectedEntities((prev) => (prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]))
  }

  const handleCreate = async () => {
    // Validation
    if (!roleName.trim()) {
      alert("Please enter a role name")
      return
    }

    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission")
      return
    }

    if (selectedEntities.length === 0) {
      alert("Please select at least one entity")
      return
    }

    // Check for duplicate role names
    if (roles.some((role) => role.toLowerCase() === roleName.trim().toLowerCase())) {
      alert("Role name already exists")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Create the role
      console.log('Creating role:', roleName.trim())
      await roleApi.createRole(roleName.trim())

      // Grant permissions to the role (only if permissions are selected)
      if (selectedPermissions.length > 0) {
        try {
          console.log('Granting permissions:', selectedPermissions)
          await roleApi.grantPermissions(roleName.trim(), selectedPermissions)
        } catch (permError) {
          console.warn('Warning: Could not grant permissions:', permError)
          // Continue even if permissions fail - role was created successfully
        }
      }

      // Reload roles to get the updated list
      await loadRoles()

      // Clear the form
      setRoleName("")
      setSelectedPermissions([])
      setSelectedEntities([])

      // Success message
      alert(`Role "${roleName.trim()}" created successfully!`)
    } catch (error) {
      console.error('Error creating role:', error)
      setError(`Failed to create role: ${error.message}`)
      alert(`Failed to create role: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleToDelete) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleToDelete}"?`)) {
      try {
        setLoading(true)
        setError("")
        
        console.log('Attempting to delete role:', roleToDelete)
        await roleApi.deleteRole(roleToDelete)
        
        // Update local state
        setRoles((prev) => prev.filter((role) => role !== roleToDelete))
        
        alert(`Role "${roleToDelete}" deleted successfully!`)
      } catch (error) {
        console.error('Error deleting role:', error)
        
        // Check if the error is about dependencies
        if (error.response && error.response.data && error.response.data.error && 
            error.response.data.error.includes("cannot be dropped because some objects depend on it")) {
          
          // Ask user if they want to remove the role from all users first
          const shouldRemoveFromUsers = window.confirm(
            `Cannot delete role "${roleToDelete}" because it is still assigned to users. ` +
            `Would you like to remove this role from all users first and then delete it?`
          )
          
          if (shouldRemoveFromUsers) {
            try {
              // Remove role from all users
              await roleApi.revokeRoleFromAllUsers(roleToDelete)
              
              // Try to delete the role again
              await roleApi.deleteRole(roleToDelete)
              
              // Update local state
              setRoles((prev) => prev.filter((role) => role !== roleToDelete))
              
              alert(`Role "${roleToDelete}" has been removed from all users and deleted successfully!`)
            } catch (removeError) {
              console.error('Error removing role from users:', removeError)
              setError('Failed to remove role from users. Please try again.')
              alert('Failed to remove role from users. Please try again.')
            }
          } else {
            setError(`Cannot delete role "${roleToDelete}" because it is still assigned to users. Please remove all users from this role first.`)
          }
        } else {
          // Show specific error message
          let errorMessage = 'Failed to delete role. Please try again.'
          if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else if (error.message) {
            errorMessage = error.message
          }
          
          setError(errorMessage)
          alert(errorMessage)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRoleClick = (roleName) => {
    setSelectedRole(roleName)
    setShowPermissionsModal(true)
  }

  return (
    <div className="role-management">
      <div className="container">
        {/* Role Creation Section */}
        <div className="role-creation">
          <h1 className="main-heading">Role Creation</h1>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div className="input-group">
            <label htmlFor="roleName" className="input-label">
              Name
            </label>
            <input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="name-input"
              placeholder="Enter role name"
              disabled={loading}
            />
          </div>

          {/* Permissions Grid */}
          <div className="permissions-grid">
            {permissions.map((permission) => (
              <button
                key={permission}
                onClick={() => togglePermission(permission)}
                className={`permission-btn ${selectedPermissions.includes(permission) ? "selected" : ""}`}
                disabled={loading}
              >
                {permission}
              </button>
            ))}
          </div>

          {/* Entities Grid */}
          <div className="entities-grid">
            {entities.map((entity) => (
              <button
                key={entity}
                onClick={() => toggleEntity(entity)}
                className={`entity-btn ${selectedEntities.includes(entity) ? "selected" : ""}`}
                disabled={loading}
              >
                {entity}
              </button>
            ))}
          </div>

          <button 
            className="create-btn" 
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {/* Role List Section */}
        <div className="role-list">
          <h2 className="section-heading">Role list</h2>
          <div className="roles-container">
            {loading && roles.length === 0 ? (
              <div className="no-roles">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="no-roles">No roles created yet</div>
            ) : (
              roles.map((role, index) => (
                <div key={`${role}-${index}`} className="role-item">
                  <span 
                    className="role-name" 
                    onClick={() => handleRoleClick(role)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    title={`Click to view permissions for ${role}`}
                  >
                    {role}
                  </span>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteRole(role)} 
                    title={`Delete ${role} role`}
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Role Permissions Modal */}
      <RolePermissionsModal
        roleName={selectedRole}
        isOpen={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false)
          setSelectedRole(null)
        }}
      />
    </div>
  )
}

export default RoleManagement
