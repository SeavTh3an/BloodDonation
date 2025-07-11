"use client"

import { useState, useEffect } from "react"
import { backupApi } from "../api/backupApi.js"
import "../styles/backup.css"

const DatabaseIcon = () => (
  <svg className="backup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
)

const CloudIcon = () => (
  <svg className="backup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="backup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const BackupDashboard = () => {
  const [backupData, setBackupData] = useState([])
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState({
    totalBackups: 0,
    totalSize: "0 MB",
    lastBackup: null,
    backups: []
  })

  // Load existing backup info on component mount
  useEffect(() => {
    loadBackupInfo()
  }, [])

  const loadBackupInfo = async () => {
    try {
      const backupStats = await backupApi.getAllBackups()
      setStats(backupStats)
      
      if (backupStats.backups && backupStats.backups.length > 0) {
        const backupItems = backupStats.backups.map(backupInfo => ({
          id: new Date(backupInfo.createdAt).getTime(),
          name: backupInfo.fileName || "Database Backup",
          lastAction: `Created on ${new Date(backupInfo.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`,
          status: "Completed",
          progress: 100,
          isProcessing: false,
          backupSize: backupInfo.fileSize,
          createdAt: backupInfo.createdAt
        }))
        
        setBackupData(backupItems)
      } else {
        setBackupData([])
      }
    } catch (error) {
      console.error('Error loading backup info:', error)
      setError('Failed to load backup information')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "backup-status-pending"
      case "Completed":
        return "backup-status-completed"
      case "Processing":
        return "backup-status-processing"
      case "Failed":
        return "backup-status-failed"
      default:
        return ""
    }
  }

  const formatCurrentTime = () => {
    const now = new Date()
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
    return `Created on ${now.toLocaleDateString("en-US", options)}`
  }

  const startBackup = async () => {
    setIsBackupRunning(true)
    setError("")
    setSuccess("")

    // Create new backup entry
    const newBackup = {
      id: Date.now(),
      name: "Database Backup",
      lastAction: formatCurrentTime(),
      status: "Processing",
      progress: 0,
      isProcessing: true,
      backupSize: "Processing...",
      createdAt: new Date().toISOString()
    }

    setBackupData(prev => [newBackup, ...prev])

    try {
      // Call backend backup API
      const backupResult = await backupApi.createBackup()

      // Reload backup info to get updated stats
      await loadBackupInfo()
      setSuccess("Backup completed successfully!")
    } catch (error) {
      console.error('Backup failed:', error)
      
      // Mark as failed
      setBackupData((prev) =>
        prev.map((item) =>
          item.id === newBackup.id
            ? {
                ...item,
                status: "Failed",
                isProcessing: false,
                backupSize: "Failed"
              }
            : item,
        ),
      )

      setError("Backup failed. Please try again.")
    } finally {
      setIsBackupRunning(false)
    }
  }

  return (
    <div className="backup-dashboard">
      <div className="backup-header">
        <h1 className="backup-title">Backup Management</h1>
        <div className="backup-controls">
          <button className="backup-button" onClick={startBackup} disabled={isBackupRunning}>
            {isBackupRunning ? "Backup in Progress..." : "Start Full Backup"}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="backup-stats">
        <div className="stat-card">
          <DatabaseIcon />
          <div className="stat-info">
            <h3>Total Backups</h3>
            <p>{stats.totalBackups}</p>
          </div>
        </div>

        <div className="stat-card">
          <CloudIcon />
          <div className="stat-info">
            <h3>Total Size</h3>
            <p>{stats.totalSize}</p>
          </div>
        </div>

        <div className="stat-card">
          <ClockIcon />
          <div className="stat-info">
            <h3>Last Backup</h3>
            <p>
              {stats.lastBackup
                ? new Date(stats.lastBackup).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Never"}
            </p>
          </div>
        </div>
      </div>

      <div className="backup-history">
        <h2>Backup History</h2>
        <div className="backup-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created At</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {backupData.map((backup) => (
                <tr key={backup.id} className={backup.isProcessing ? "processing" : ""}>
                  <td>{backup.name}</td>
                  <td>
                    {backup.createdAt
                      ? new Date(backup.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "In Progress"}
                  </td>
                  <td>{backup.backupSize}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(backup.status)}`}>
                      {backup.status}
                    </span>
                  </td>
                </tr>
              ))}
              {backupData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No backups available. Click "Start Full Backup" to create your first backup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BackupDashboard
