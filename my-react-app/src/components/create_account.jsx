import React, { useState, useEffect } from 'react'
import { userApi } from '../api/userApi.js'
import { roleApi } from '../api/roleApi.js'
import '../styles/create_account.css'

const CreateAccountForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phoneNumber: '',
    type: '',
    country: '',
    password: '',
    confirmPassword: '',
    role: '',
    hospital: '',
    image: null
  })

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load roles from backend on component mount
  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const rolesData = await roleApi.getAllRoles()
      // Extract role names from the database response
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required")
      return
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }

    if (!formData.password) {
      setError("Password is required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.role) {
      setError("Role is required")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      // Create username from first and last name
      const username = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`

      // Create user in database
      await userApi.createUser(username, formData.password)

      // Assign role to user if role exists
      if (formData.role && roles.includes(formData.role)) {
        try {
          await roleApi.assignRoleToUser(formData.role, username)
        } catch (roleError) {
          console.error('Error assigning role:', roleError)
          // Continue even if role assignment fails
        }
      }

      setSuccess("Account created successfully!")
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        email: '',
        phoneNumber: '',
        type: '',
        country: '',
        password: '',
        confirmPassword: '',
        role: '',
        hospital: '',
        image: null
      })

      // Reload roles to get updated list
      await loadRoles()

    } catch (error) {
      console.error('Error creating account:', error)
      setError('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const userData = [
    {
      name: 'Thean',
      phoneNumber: '077941841',
      type: 'Transfer',
      role: 'Doctor',
      dateOfBirth: '25 Jan, 10.40 PM',
      id: '#12548796',
      hospital: 'Calmet'
    },
    {
      name: 'Mobile Service',
      phoneNumber: '#12548796',
      type: 'Service',
      role: '1234 ****',
      dateOfBirth: '20 Jan, 10.40 PM',
      id: '#12548796',
      hospital: 'Calmet'
    },
    {
      name: 'Wilson',
      phoneNumber: '#12548796',
      type: 'Transfer',
      role: '1234 ****',
      dateOfBirth: '15 Jan, 03.29 PM',
      id: '#12548796',
      hospital: 'Calmet'
    },
    {
      name: 'Emilly',
      phoneNumber: '#12548796',
      type: 'Transfer',
      role: '1234 ****',
      dateOfBirth: '14 Jan, 10.40 PM',
      id: '#12548796',
      hospital: 'Calmet'
    }
  ]

  return (
    <div className="create-account-container">
      <div className="form-section">
        <div className="header">
          <h1 className="title">Create account</h1>
          <p className="subtitle">For Keep track patient & control database</p>
        </div>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of birth (MM/DD/YY)</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input date-input"
                  disabled={loading}
                />
                <svg className="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <div className="select-wrapper">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select type</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
                <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <div className="select-wrapper">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={loading}
                  required
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hospital">Hospital</label>
              <input
                type="text"
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-bottom">
            <div className="form-group image-upload">
              <label htmlFor="image">Image</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*"
                  disabled={loading}
                />
                <div className="file-upload-display">
                  <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
              </div>
            </div>

            <button type="submit" className="create-button" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="info-section">
        <div className="description">
          <p className="description-title">
            Register a new database user and assign the appropriate role and access level.
          </p>
          <p className="description-text">
            This form is intended for system administrators to manage user identities and maintain access control within the platform.
          </p>
        </div>

        <div className="user-table">
          <div className="table-header">
            <div className="header-cell">Name</div>
            <div className="header-cell">Phone number</div>
            <div className="header-cell">Type</div>
            <div className="header-cell">Role</div>
            <div className="header-cell">Date of birth</div>
            <div className="header-cell">ID</div>
            <div className="header-cell">Hospital</div>
          </div>
          <div className="table-body">
            {userData.map((user, index) => (
              <div key={index} className="table-row">
                <div className="table-cell" data-label="Name">{user.name}</div>
                <div className="table-cell" data-label="Phone number">{user.phoneNumber}</div>
                <div className="table-cell" data-label="Type">{user.type}</div>
                <div className="table-cell" data-label="Role">{user.role}</div>
                <div className="table-cell" data-label="Date of birth">{user.dateOfBirth}</div>
                <div className="table-cell" data-label="ID">{user.id}</div>
                <div className="table-cell" data-label="Hospital">{user.hospital}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountForm
