import { useState, useEffect } from "react"
import { userApi } from "../api/userApi.js"
import { roleApi } from "../api/roleApi.js"
import "../styles/member_status.css"
import { useNavigate } from "react-router-dom"
import CreateAccountForm from "./create_account.jsx"

const MemberManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [permLoading, setPermLoading] = useState(false)
  const [permError, setPermError] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const usersData = await userApi.getAllUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (user) => {
    setSelectedUser(user)
    setUserRoles([])
    setUserPermissions([])
    setPermError("")
    setPermLoading(true)
    try {
      const roles = await roleApi.getUserRoles(user.username || user.usename)
      setUserRoles(roles.map(r => r.rolname))
      const perms = await userApi.getUserPermissions(user.username || user.usename)
      setUserPermissions(perms)
    } catch (err) {
      setPermError("Failed to load roles or permissions")
    } finally {
      setPermLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedUser(null)
    setUserRoles([])
    setUserPermissions([])
    setPermError("")
  }

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Are you sure you want to delete user '${username}'?`)) return
    try {
      setLoading(true)
      await userApi.deleteUser(username)
      await loadUsers()
    } catch (err) {
      setError('Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  // Remove getStatus and all status logic

  // User Permissions Modal (styled like role-permissions-modal)
  const renderUserPermissionsModal = () => {
    if (!selectedUser) return null
    return (
      <div className="modal-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div className="modal-content" style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div className="modal-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>Permissions for User: {selectedUser.username || selectedUser.usename}</h2>
            <button 
              onClick={closeModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>
          {permError && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
              {permError}
            </div>
          )}
          <div className="modal-body">
            {permLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading permissions...
              </div>
            ) : (
              <div>
                {userPermissions && userPermissions.tables && userPermissions.tables.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    <p>This user has no permissions assigned yet.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>Table Permissions</h3>
                      {renderTablePermissions(userPermissions)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer" style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid #eee',
            textAlign: 'right'
          }}>
            <button
              onClick={closeModal}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Revoke a permission for a user on a table
  const handleRevokeTablePermission = async (perm, tableGroup) => {
    try {
      setPermLoading(true)
      await userApi.revokePermissions(selectedUser.username || selectedUser.usename, [perm], tableGroup.table)
      // Refresh permissions
      const perms = await userApi.getUserPermissions(selectedUser.username || selectedUser.usename)
      setUserPermissions(perms)
    } catch (error) {
      setPermError('Failed to revoke permission. Please try again.')
    } finally {
      setPermLoading(false)
    }
  }

  // Render table permissions grouped by table, with revoke button
  const renderTablePermissions = (permissions) => {
    if (!permissions || !permissions.tables || permissions.tables.length === 0) return null
    // Group permissions by table
    const tableGroups = permissions.tables.reduce((groups, perm) => {
      const key = `${perm.schemaname}.${perm.tablename}`
      if (!groups[key]) {
        groups[key] = {
          schema: perm.schemaname,
          table: perm.tablename,
          permissions: []
        }
      }
      groups[key].permissions.push(perm.privilege_type)
      return groups
    }, {})
    return Object.values(tableGroups).map((tableGroup, index) => (
      <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px', fontWeight: '600' }}>
          {tableGroup.schema}.{tableGroup.table}
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tableGroup.permissions.map((perm, permIndex) => (
            <span
              key={permIndex}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {perm}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
                title={`Revoke ${perm} on ${tableGroup.schema}.${tableGroup.table}`}
                disabled={permLoading}
                onClick={() => handleRevokeTablePermission(perm, tableGroup)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    ))
  }

  // Toggle user status (active/inactive)
  const handleToggleStatus = async (user) => {
    const username = user.username || user.usename
    const newStatus = user.rolcanlogin === false || user.rolcanlogin === 'false' ? 'Active' : 'Inactive'
    try {
      setLoading(true)
      await userApi.updateUserStatus(username, newStatus)
      await loadUsers()
    } catch (err) {
      setError('Failed to update user status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="member-management" style={{ background: '#f5f6fa', minHeight: '100vh', padding: '32px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#22223b', letterSpacing: 1 }}>User Management</h2>
          <button onClick={() => navigate('/adduser')} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>+ Create User</button>
        </div>
        {error && <div className="error" style={{ color: '#e63946', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
        <table className="user-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f1f3f8' }}>
              <th style={{ color: '#22223b', fontWeight: 600, padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>Username</th>
              <th style={{ color: '#22223b', fontWeight: 600, padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>Role</th>
              <th style={{ color: '#22223b', fontWeight: 600, padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username || user.usename} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 8px', color: '#007bff', fontSize: 16, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleUserClick(user)}>
                  {user.username || user.usename}
                </td>
                <td style={{ padding: '10px 8px', color: '#22223b', fontSize: 15 }}>
                  <RoleCell user={user} />
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button onClick={() => handleDeleteUser(user.username || user.usename)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderUserPermissionsModal()}
      </div>
    </div>
  )
}

// Helper component to fetch and display roles for a user in the table
const RoleCell = ({ user }) => {
  const [roles, setRoles] = useState([])
  useEffect(() => {
    let mounted = true
    roleApi.getUserRoles(user.username || user.usename).then(r => {
      if (mounted) setRoles(r.map(rr => rr.rolname))
    }).catch(() => setRoles([]))
    return () => { mounted = false }
  }, [user.username, user.usename])
  return <span>{roles.length > 0 ? roles.join(', ') : '-'}</span>
}

export default MemberManagement
