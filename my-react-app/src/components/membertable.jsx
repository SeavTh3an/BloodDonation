import "../styles/membertable.css"

import { useState } from "react"

const MemberTable = () => {
  const [members, setMembers] = useState([
    { id: 1, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 2, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 3, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 4, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 5, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 6, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 7, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
    { id: 8, name: "Jane Cooper", phone: "(225) 555-0118", email: "jane@microsoft.com", roles: ["Developer"] },
  ])

  const [editingMember, setEditingMember] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", roles: [] })
  const [newRole, setNewRole] = useState("")

  const availableRoles = ["Developer", "Designer", "Manager", "Admin", "Tester", "DevOps", "Analyst"]

  const handleEdit = (member) => {
    setEditingMember(member.id)
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      roles: [...member.roles]
    })
    setShowModal(true)
  }

  const handleSave = () => {
    setMembers(members.map(member => 
      member.id === editingMember 
        ? { ...member, ...formData }
        : member
    ))
    setShowModal(false)
    setEditingMember(null)
    setFormData({ name: "", phone: "", email: "", roles: [] })
  }

  const handleCancel = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({ name: "", phone: "", email: "", roles: [] })
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

  const handleDelete = (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter(member => member.id !== memberId))
    }
  }

  return (
    <div className="member-table-container">
      <h1 className="table-title">All Member</h1>

      <div className="table-wrapper">
        {/* Desktop Table */}
        <div className="table-desktop">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-cell">Member</div>
            <div className="header-cell">ID</div>
            <div className="header-cell">Email</div>
            <div className="header-cell">Role</div>
            <div className="header-cell">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="table-body">
            {members.map((member) => (
              <div key={member.id} className="table-row">
                <div className="table-cell member-name">{member.name}</div>
                <div className="table-cell member-id">{member.phone}</div>
                <div className="table-cell member-email">{member.email}</div>
                <div className="table-cell member-role">
                  <div className="roles-container">
                    {member.roles.map((role, index) => (
                      <span key={index} className="role-badge">{role}</span>
                    ))}
                  </div>
                </div>
                <div className="table-cell actions-cell">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(member)}>
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(member.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="table-mobile">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="card-header">
                <h3 className="card-name">{member.name}</h3>
                <div className="roles-container">
                  {member.roles.map((role, index) => (
                    <span key={index} className="role-badge">{role}</span>
                  ))}
                </div>
              </div>
              <div className="card-details">
                <div className="card-row">
                  <span className="card-label">ID:</span>
                  <span className="card-value">{member.phone}</span>
                </div>
                <div className="card-row">
                  <span className="card-label">Email:</span>
                  <span className="card-value">{member.email}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn edit-btn" onClick={() => handleEdit(member)}>
                  Edit
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(member.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="table-footer">Showing data 1 to {members.length} of 256K entries</div>

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
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
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
                      disabled={!newRole}
                    >
                      Add Role
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberTable
