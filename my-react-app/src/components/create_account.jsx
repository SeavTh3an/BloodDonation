import React, { useState, useEffect } from 'react'
import { userApi } from '../api/userApi.js'
import { roleApi } from '../api/roleApi.js'
import '../styles/create_account.css'

const permissionsList = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "TRIGGER", "ALL PRIVILEGES"];
const entitiesList = [
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
];

const CreateAccountForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  })
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [selectedEntities, setSelectedEntities] = useState([])

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const rolesData = await roleApi.getAllRoles()
      const roleNames = rolesData.map(role => role.rolname).filter(name => 
        !name.startsWith('pg_') && name !== 'postgres' && name !== 'template0' && name !== 'template1'
      )
      setRoles(roleNames)
    } catch (error) {
      console.error('Error loading roles:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePermission = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const toggleEntity = (entity) => {
    setSelectedEntities((prev) => (prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username.trim()) {
      setError("Username is required")
      return
    }
    if (!formData.password) {
      setError("Password is required")
      return
    }
    // If no role, permissions and entities are required
    if (!formData.role) {
      if (selectedPermissions.length === 0) {
        setError("Please select at least one permission (or select a role)")
        return
      }
      if (selectedEntities.length === 0) {
        setError("Please select at least one entity (or select a role)")
        return
      }
    }
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      // Create user in database
      await userApi.createUser(formData.username, formData.password)
      // Assign role to user if role exists
      if (formData.role && roles.includes(formData.role)) {
        try {
          await roleApi.assignRoleToUser(formData.role, formData.username)
        } catch (roleError) {
          console.error('Error assigning role:', roleError)
        }
      }
      // Grant permissions to user for each selected entity (only if permissions are selected)
      if (selectedPermissions.length > 0 && selectedEntities.length > 0) {
        for (const entity of selectedEntities) {
          await userApi.grantPermissions(formData.username, {
            permissions: selectedPermissions,
            entity: entity.toLowerCase().replace(' ', '_')
          })
        }
      }
      setSuccess("Account created and permissions granted successfully!")
      setFormData({ username: '', password: '', role: '' })
      setSelectedPermissions([])
      setSelectedEntities([])
      await loadRoles()
    } catch (error) {
      console.error('Error creating account or granting permissions:', error)
      setError('Failed to create account or grant permissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-account-container" style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#fff'}}>
      <div className="form-section" style={{ width: '100%', maxWidth: 900, background: 'none', borderRadius: 0, boxShadow: 'none', padding: '48px 0 0 0', margin: 0 }}>
        <form className="account-form" onSubmit={handleSubmit} style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Row for name, password, role */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 36 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="username" style={{ fontWeight: 600, color: '#22223b', fontSize: 18, marginBottom: 8 }}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
                style={{ border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '18px 16px', fontSize: 18, width: '100%', background: 'white', color: '#22223b', outline: 'none', height: 56 }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="password" style={{ fontWeight: 600, color: '#22223b', fontSize: 18, marginBottom: 8 }}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
                style={{ border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '18px 16px', fontSize: 18, width: '100%', background: 'white', color: '#22223b', outline: 'none', height: 56 }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="role" style={{ fontWeight: 600, color: '#22223b', fontSize: 18, marginBottom: 8 }}>Role</label>
              <div className="select-wrapper" style={{ width: '100%' }}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={loading}
                  style={{ border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '18px 16px', fontSize: 18, width: '100%', background: 'white', color: '#22223b', outline: 'none', height: 56 }}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {error && <div className="error-message" style={{ color: '#e63946', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          {success && <div className="success-message" style={{ color: '#10b981', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}
          {/* Permissions Row */}
          <div className="permissions-row" style={{ margin: '0 0 32px 0' }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: '#22223b', marginBottom: 16 }}>Permissions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'flex-start' }}>
              {permissionsList.map((permission) => (
                <button
                  key={permission}
                  type="button"
                  onClick={() => togglePermission(permission)}
                  className={`permission-btn ${selectedPermissions.includes(permission) ? "selected" : ""}`}
                  disabled={loading}
                  style={{
                    background: selectedPermissions.includes(permission) ? '#ff0050' : 'white',
                    color: selectedPermissions.includes(permission) ? 'white' : '#22223b',
                    border: selectedPermissions.includes(permission) ? '2px solid #ff0050' : '2px solid #e0e0e0',
                    borderRadius: 12,
                    padding: '18px 32px',
                    fontWeight: 600,
                    fontSize: 20,
                    cursor: 'pointer',
                    boxShadow: 'none',
                    outline: selectedPermissions.includes(permission) ? '2px solid #ff0050' : 'none',
                    transition: 'border 0.2s, outline 0.2s, background 0.2s, color 0.2s',
                  }}
                >
                  {permission}
                </button>
              ))}
            </div>
          </div>
          {/* Entities Row */}
          <div className="entities-row" style={{ margin: '0 0 32px 0' }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: '#22223b', marginBottom: 16 }}>Entities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'flex-start' }}>
              {entitiesList.map((entity) => (
                <button
                  key={entity}
                  type="button"
                  onClick={() => toggleEntity(entity)}
                  className={`entity-btn ${selectedEntities.includes(entity) ? "selected" : ""}`}
                  disabled={loading}
                  style={{
                    background: selectedEntities.includes(entity) ? '#ff0050' : 'white',
                    color: selectedEntities.includes(entity) ? 'white' : '#22223b',
                    border: selectedEntities.includes(entity) ? '2px solid #ff0050' : '2px solid #e0e0e0',
                    borderRadius: 12,
                    padding: '18px 32px',
                    fontWeight: 600,
                    fontSize: 20,
                    cursor: 'pointer',
                    boxShadow: 'none',
                    outline: selectedEntities.includes(entity) ? '2px solid #ff0050' : 'none',
                    transition: 'border 0.2s, outline 0.2s, background 0.2s, color 0.2s',
                  }}
                >
                  {entity}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="create-button" disabled={loading} style={{ width: 220, height: 60, marginTop: 32, background: '#ff0050', color: 'white', border: 'none', borderRadius: 30, fontWeight: 700, fontSize: 24, letterSpacing: 1, display: 'block', marginLeft: 0 }}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateAccountForm

