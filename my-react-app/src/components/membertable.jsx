import { useState, useEffect } from "react"
import { userApi } from "../api/userApi.js"
import { roleApi } from "../api/roleApi.js"
import RolePermissionsModal from "./role-permissions-modal.jsx"
import "../styles/membertable.css"

const MemberTable = () => {
  const [members, setMembers] = useState([])
  const [availableRoles, setAvailableRoles] = useState([])
  const [editingMember, setEditingMember] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: "", roles: [] })
  const [newRole, setNewRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)

  // Load users and roles from backend on component mount
  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      console.log('Loading users for member table...')
      const usersData = await userApi.getAllUsers()
      console.log('Users data received for member table:', usersData)
      
      // Transform database users to match the expected format
      const transformedUsers = await Promise.all(usersData.map(async (user, index) => {
        // Load user roles for each user
        let userRoles = []
        try {
          const rolesData = await roleApi.getUserRoles(user.usename || user.username)
          userRoles = rolesData.map(role => role.rolname)
        } catch (roleError) {
          console.error(`Error loading roles for user ${user.usename}:`, roleError)
        }

        return {
          id: index + 1,
          name: user.usename || user.username || 'Unknown',
          roles: userRoles,
          username: user.usename || user.username,
          status: 'Active' // Default status
        }
      }))
      
      console.log('Transformed users for member table:', transformedUsers)
      setMembers(transformedUsers)
    } catch (error) {
      console.error('Error loading users for member table:', error)
      setError(`Failed to load users: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      console.log('Loading roles for member table...')
      const rolesData = await roleApi.getAllRoles()
      console.log('Roles data received for member table:', rolesData)
      // Extract role names from the database response
      const roleNames = rolesData.map(role => role.rolname)
      console.log('Filtered role names for member table:', roleNames)
      setAvailableRoles(roleNames)
    } catch (error) {
      console.error('Error loading roles for member table:', error)
      setError(`Failed to load roles: ${error.message}`)
    }
  }

  const handleEdit = async (member) => {
    setEditingMember(member.id)
    setFormData({
      name: member.name,
      roles: [...member.roles]
    })
    setShowModal(true)

    // Load user's current roles from database
    try {
      const userRoles = await roleApi.getUserRoles(member.username)
      const roleNames = userRoles.map(role => role.rolname)
      setFormData(prev => ({
        ...prev,
        roles: roleNames
      }))
    } catch (error) {
      console.error('Error loading user roles:', error)
      // Continue with empty roles if loading fails
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError("")

      const memberToUpdate = members.find(member => member.id === editingMember)
      if (!memberToUpdate) {
        throw new Error("Member not found")
      }

      // Get original roles and new roles
      const originalRoles = memberToUpdate.roles || []
      const newRoles = formData.roles || []

      // Find roles to add and remove
      const rolesToAdd = newRoles.filter(role => !originalRoles.includes(role))
      const rolesToRemove = originalRoles.filter(role => !newRoles.includes(role))

      // Assign new roles
      for (const role of rolesToAdd) {
        try {
          await roleApi.assignRoleToUser(role, memberToUpdate.username)
        } catch (roleError) {
          console.error(`Error assigning role ${role} to user ${memberToUpdate.username}:`, roleError)
        }
      }

      // Revoke removed roles
      for (const role of rolesToRemove) {
        try {
          await roleApi.revokeRoleFromUser(role, memberToUpdate.username)
        } catch (roleError) {
          console.error(`Error revoking role ${role} from user ${memberToUpdate.username}:`, roleError)
        }
      }

      // Update the member in the local state
      setMembers(members.map(member => 
        member.id === editingMember 
          ? { ...member, ...formData }
          : member
      ))
      
      // Force reload users from backend to ensure UI is up to date
      await loadUsers()
      
      setShowModal(false)
      setEditingMember(null)
      setFormData({ name: "", roles: [] })
      setNewRole("")
    } catch (error) {
      console.error('Error saving member:', error)
      setError(`Failed to save member: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({ name: "", roles: [] })
    setNewRole("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addRole = () => {
    if (newRole && !formData.roles.includes(newRole)) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole]
      }))
      setNewRole("")
    }
  }

  const removeRole = (roleToRemove) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }))
  }

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        setLoading(true)
        setError("")
        
        const memberToDelete = members.find(member => member.id === memberId)
        if (memberToDelete) {
          await userApi.deleteUser(memberToDelete.username)
          setMembers(members.filter(member => member.id !== memberId))
        }
      } catch (error) {
        console.error('Error deleting member:', error)
        setError(`Failed to delete member: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleStatus = async (memberId) => {
    try {
      setLoading(true)
      setError("")
      
      const memberToToggle = members.find(member => member.id === memberId)
      if (memberToToggle) {
        const newStatus = memberToToggle.status === 'Active' ? 'Inactive' : 'Active'
        
        // Update user status in database
        await userApi.updateUserStatus(memberToToggle.username, newStatus)
        
        // Update local state
        setMembers(members.map(member => 
          member.id === memberId 
            ? { ...member, status: newStatus }
            : member
        ))
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      setError(`Failed to update user status: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleClick = (roleName) => {
    setSelectedRole(roleName)
    setShowPermissionsModal(true)
  }

  return (
    <div className="member-table-container">
      <h1 className="table-title">All Member</h1>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

      <div className="table-wrapper">
        {/* Desktop Table */}
        <div className="table-desktop">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-cell">Member</div>
            <div className="header-cell">Role</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="table-body">
            {loading && members.length === 0 ? (
              <div className="loading-row" style={{ textAlign: 'center', padding: '20px' }}>
                Loading members...
              </div>
            ) : members.length === 0 ? (
              <div className="no-members" style={{ textAlign: 'center', padding: '20px' }}>
                No members found
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="table-row">
                  <div className="table-cell member-name">{member.name}</div>
                  <div className="table-cell member-role">
                    <div className="roles-container">
                      {member.roles.length === 0 ? (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>No roles assigned</span>
                      ) : (
                        member.roles.map((role, index) => (
                          <span 
                            key={index} 
                            className="role-badge"
                            onClick={() => handleRoleClick(role)}
                            style={{ cursor: 'pointer' }}
                            title={`Click to view permissions for ${role}`}
                          >
                            {role}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="table-cell member-status">
                    <button 
                      className={`status-toggle ${member.status.toLowerCase()}`}
                      onClick={() => toggleStatus(member.id)}
                      disabled={loading}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: member.status === 'Active' ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}
                    >
                      {member.status}
                    </button>
                  </div>
                  <div className="table-cell actions-cell">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(member)} disabled={loading}>
                      Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(member.id)} disabled={loading}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="table-mobile">
          {loading && members.length === 0 ? (
            <div className="loading-card" style={{ textAlign: 'center', padding: '20px' }}>
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="no-members-card" style={{ textAlign: 'center', padding: '20px' }}>
              No members found
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="member-card">
                <div className="card-header">
                  <h3 className="card-name">{member.name}</h3>
                  <div className="roles-container">
                    {member.roles.length === 0 ? (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>No roles assigned</span>
                    ) : (
                      member.roles.map((role, index) => (
                        <span 
                          key={index} 
                          className="role-badge"
                          onClick={() => handleRoleClick(role)}
                          style={{ cursor: 'pointer' }}
                          title={`Click to view permissions for ${role}`}
                        >
                          {role}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div className="card-details">
                  <div className="card-row">
                    <span className="card-label">Status:</span>
                    <button 
                      className={`status-toggle ${member.status.toLowerCase()}`}
                      onClick={() => toggleStatus(member.id)}
                      disabled={loading}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: member.status === 'Active' ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}
                    >
                      {member.status}
                    </button>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(member)} disabled={loading}>
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(member.id)} disabled={loading}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="table-footer">Showing data 1 to {members.length} of {members.length} entries</div>

      {/* Role Permissions Modal */}
      <RolePermissionsModal
        roleName={selectedRole}
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
      />

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Roles:</label>
                <div className="roles-section">
                  <div className="current-roles">
                    {formData.roles.map((role, index) => (
                      <div key={index} className="role-item">
                        <span className="role-badge">{role}</span>
                        <button 
                          className="remove-role-btn"
                          onClick={() => removeRole(role)}
                          type="button"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-role-section">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="role-select"
                      disabled={loading}
                    >
                      <option value="">Select a role</option>
                      {availableRoles
                        .filter(role => !formData.roles.includes(role))
                        .map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))
                      }
                    </select>
                    <button 
                      className="add-role-btn"
                      onClick={addRole}
                      type="button"
                      disabled={!newRole || loading}
                    >
                      Add Role
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberTable
