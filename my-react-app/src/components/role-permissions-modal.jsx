import { useState, useEffect } from "react"
import { roleApi } from "../api/roleApi.js"

const RolePermissionsModal = ({ roleName, isOpen, onClose }) => {
  const [permissions, setPermissions] = useState({ tables: [], database: [], schemas: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && roleName) {
      loadRolePermissions()
    }
  }, [isOpen, roleName])

  const loadRolePermissions = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log('Loading permissions for role:', roleName)
      const permissionsData = await roleApi.getRolePermissions(roleName)
      console.log('Permissions data received:', permissionsData)
      setPermissions(permissionsData)
    } catch (error) {
      console.error('Error loading role permissions:', error)
      setError(`Failed to load role permissions: ${error.message}`)
      // Set empty permissions instead of failing completely
      setPermissions({ tables: [], database: [], schemas: [] })
    } finally {
      setLoading(false)
    }
  }

  // Add revoke handler
  const handleRevokeTablePermission = async (perm, tableGroup) => {
    try {
      setLoading(true)
      // Pass only the table name, not schema.table
      await roleApi.revokePermissions(roleName, [perm], tableGroup.table)
      await loadRolePermissions()
    } catch (error) {
      setError('Failed to revoke permission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderTablePermissions = () => {
    if (!permissions.tables || permissions.tables.length === 0) {
      return <p style={{ color: '#666', fontStyle: 'italic' }}>No table permissions found</p>
    }

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
                disabled={loading}
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

  // Remove renderRoleInfo, renderDatabasePermissions, renderSchemaPermissions, and their calls in the modal body
  // Only show table permissions

  if (!isOpen) return null

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
          <h2 style={{ margin: 0, color: '#333' }}>Permissions for Role: {roleName}</h2>
          <button 
            onClick={onClose}
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

        {error && (
          <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Loading permissions...
            </div>
          ) : (
            <div>
              {permissions.tables.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>This role has no permissions assigned yet.</p>
                  <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Permissions can be granted through the role creation process or by a database administrator.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px', color: '#555', fontSize: '16px' }}>Table Permissions</h3>
                    {renderTablePermissions()}
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
            onClick={onClose}
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

export default RolePermissionsModal 