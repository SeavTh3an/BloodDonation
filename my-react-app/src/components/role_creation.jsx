"use client"

import { useState } from "react"
import "../styles/role_creation.css"

const RoleManagement = () => {
  const [roleName, setRoleName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [selectedEntities, setSelectedEntities] = useState([])
  const [roles, setRoles] = useState(["Developers", "Nurse", "Admin"]) // Dynamic roles list

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

  const togglePermission = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const toggleEntity = (entity) => {
    setSelectedEntities((prev) => (prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]))
  }

  const handleCreate = () => {
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

    // Add new role to the list
    setRoles((prev) => [...prev, roleName.trim()])

    // Clear the form
    setRoleName("")
    setSelectedPermissions([])
    setSelectedEntities([])

    // Success message
    alert(`Role "${roleName.trim()}" created successfully!`)
  }

  const handleDeleteRole = (roleToDelete) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleToDelete}"?`)) {
      setRoles((prev) => prev.filter((role) => role !== roleToDelete))
    }
  }

  return (
    <div className="role-management">
      <div className="container">
        {/* Role Creation Section */}
        <div className="role-creation">
          <h1 className="main-heading">Role Creation</h1>

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
            />
          </div>

          {/* Permissions Grid */}
          <div className="permissions-grid">
            {permissions.map((permission) => (
              <button
                key={permission}
                onClick={() => togglePermission(permission)}
                className={`permission-btn ${selectedPermissions.includes(permission) ? "selected" : ""}`}
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
              >
                {entity}
              </button>
            ))}
          </div>

          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>

        {/* Role List Section */}
        <div className="role-list">
          <h2 className="section-heading">Role list</h2>
          <div className="roles-container">
            {roles.length === 0 ? (
              <div className="no-roles">No roles created yet</div>
            ) : (
              roles.map((role, index) => (
                <div key={`${role}-${index}`} className="role-item">
                  <span className="role-name">{role}</span>
                  <button className="delete-btn" onClick={() => handleDeleteRole(role)} title={`Delete ${role} role`}>
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleManagement
