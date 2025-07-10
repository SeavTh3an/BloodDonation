import { useState, useEffect } from "react"
import { userApi } from "../api/userApi.js"
import "../styles/member_status.css"
import { useNavigate } from "react-router-dom"

const MemberManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load users from backend on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const usersData = await userApi.getAllUsers()
      
      // Transform database users to match the expected format
      const transformedUsers = usersData.map(user => ({
        name: user.usename || user.username || 'Unknown',
        email: `${user.usename || user.username}@blooddonation.com`, // Generate email from username
        status: 'Active', // Default status since backend doesn't have status field
        username: user.usename || user.username
      }))
      
      setUsers(transformedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete the user "${username}"?`)) {
      try {
        setLoading(true)
        setError("")
        
        await userApi.deleteUser(username)
        
        // Reload users to get the updated list
        await loadUsers()
        
        alert(`User "${username}" deleted successfully!`)
      } catch (error) {
        console.error('Error deleting user:', error)
        setError('Failed to delete user. Please try again.')
        alert('Failed to delete user. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleStatus = async (username) => {
    try {
      setLoading(true)
      setError("")
      
      const userToToggle = users.find(user => user.username === username)
      if (userToToggle) {
        const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active'
        
        // Update user status in database
        await userApi.updateUserStatus(username, newStatus)
        
        // Update local state
        setUsers(users.map(user => 
          user.username === username 
            ? { ...user, status: newStatus }
            : user
        ))
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      setError(`Failed to update user status: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="member-management">
      <div className="header1">
        <div className="header-left">
          <h1 className="title">All Member</h1>
          <p className="subtitle">Active Members</p>
        </div>
        <div className="header-right">
          <button className="add-button" onClick={() => navigate("/adduser")}>
            <span className="plus-icon">+</span>
          </button>
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select">
              <option>Newest</option>
              <option>Oldest</option>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

      <div className="table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td className="member-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className={`status-badge ${user.status.toLowerCase()}`}
                      onClick={() => toggleStatus(user.username)}
                      disabled={loading}
                      style={{
                        background: user.status === 'Active' ? '#10b981' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                      title={`Click to toggle status (currently ${user.status})`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteUser(user.username)}
                      title={`Delete ${user.name}`}
                      disabled={loading}
                      style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">Showing data 1 to {users.length} of {users.length} entries</div>
        <div className="pagination-controls">
          <button className="pagination-arrow" disabled={loading}>‹</button>
          <button className="pagination-number active">1</button>
          <button className="pagination-arrow" disabled={loading}>›</button>
        </div>
      </div>
    </div>
  )
}

export default MemberManagement
