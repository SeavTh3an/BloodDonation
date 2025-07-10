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
    completedBackups: 0,
    totalSize: "0 MB",
    lastBackup: "Never",
  })

  // Load existing backup info on component mount
  useEffect(() => {
    loadBackupInfo()
  }, [])

  const loadBackupInfo = async () => {
    try {
      const backupInfo = await backupApi.getBackupInfo()
      if (backupInfo.exists) {
        const backupItem = {
          id: 1,
          name: backupInfo.fileName || "Database Backup",
          type: "Full",
          lastAction: `Last backup ${new Date(backupInfo.createdAt).toLocaleDateString("en-US", {
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
          sourceSize: "Database",
          backupSize: backupInfo.fileSize,
          duration: "Completed",
          compression: "N/A",
          createdAt: backupInfo.createdAt,
          modifiedAt: backupInfo.modifiedAt,
          filePath: backupInfo.filePath
        }
        
        setBackupData([backupItem])
        setStats({
          totalBackups: 1,
          completedBackups: 1,
          totalSize: backupInfo.fileSize,
          lastBackup: new Date(backupInfo.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        })
      } else {
        setBackupData([])
        setStats({
          totalBackups: 0,
          completedBackups: 0,
          totalSize: "0 MB",
          lastBackup: "Never",
        })
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

  const getBadgeClass = (type) => {
    switch (type) {
      case "Full":
        return "badge-full"
      case "Incremental":
        return "badge-incremental"
      case "Differential":
        return "badge-differential"
      default:
        return "badge-full"
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
    return `last backup ${now.toLocaleDateString("en-US", options)}`
  }

  const startBackup = async () => {
    setIsBackupRunning(true)
    setError("")
    setSuccess("")

    // Create new backup entry
    const newBackup = {
      id: Date.now(),
      name: "Database Backup",
      type: "Full",
      lastAction: formatCurrentTime(),
      status: "Processing",
      progress: 0,
      isProcessing: true,
      sourceSize: "Database",
      backupSize: "Processing...",
      duration: "In progress",
      compression: "N/A",
    }

    setBackupData([newBackup])

    try {
      // Call backend backup API
      const backupResult = await backupApi.createBackup()

      // Mark as completed and update with actual data
      setBackupData((prev) =>
        prev.map((item) =>
          item.id === newBackup.id
            ? {
                ...item,
                status: "Completed",
                progress: 100,
                isProcessing: false,
                backupSize: backupResult.fileSize || "Unknown",
                duration: "Completed",
                createdAt: backupResult.createdAt,
                modifiedAt: backupResult.modifiedAt,
                filePath: backupResult.filePath
              }
            : item,
        ),
      )

      setStats({
        totalBackups: 1,
        completedBackups: 1,
        totalSize: backupResult.fileSize || "Unknown",
        lastBackup: "Just now",
      })

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
                backupSize: "Failed",
                duration: "Failed",
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
        <button className="backup-button" onClick={startBackup} disabled={isBackupRunning}>
          {isBackupRunning ? "Backup in Progress..." : "Start Backup"}
        </button>
      </div>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}

      <div className="backup-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalBackups}</div>
          <div className="stat-label">Total Backups</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedBackups}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalSize}</div>
          <div className="stat-label">Total Size</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.lastBackup}</div>
          <div className="stat-label">Last Backup</div>
        </div>
      </div>

      <div className="backup-cards-grid">
        {backupData.length === 0 ? (
          <div className="no-backups" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No backups created yet. Click "Start Backup" to create your first backup.
          </div>
        ) : (
          backupData.map((item) => (
            <div
              key={item.id}
              className={`backup-card ${item.isProcessing ? "processing backup-pulse" : ""} ${
                item.status === "Pending" ? "pending" : ""
              }`}
            >
              <div className="backup-card-header">
                <h2 className="backup-card-title">
                  {item.name}
                  <span className={`backup-type-badge ${getBadgeClass(item.type)}`}>{item.type}</span>
                </h2>
                <p className="backup-card-subtitle">{item.lastAction}</p>
              </div>

              <div className="backup-card-content">
                <div className="backup-column">
                  <DatabaseIcon />
                  <p className="backup-column-label">Source</p>
                  <p className="backup-column-value">{item.sourceSize}</p>
                </div>

                <div className="backup-column">
                  <CloudIcon />
                  <p className="backup-column-label">Backup</p>
                  <p className="backup-column-value">{item.backupSize}</p>
                </div>

                <div className="backup-column">
                  <ClockIcon />
                  <p className="backup-column-label">Status</p>
                  <p className={`backup-column-value ${getStatusClass(item.status)}`}>
                    {item.status === "Processing" ? (
                      <span className="backup-processing-indicator">
                        <span className="backup-spinner"></span>
                        Processing
                      </span>
                    ) : (
                      item.status
                    )}
                  </p>
                </div>
              </div>

              {item.isProcessing && (
                <div className="backup-progress-bar">
                  <div className="backup-progress-fill" style={{ width: `${item.progress}%` }}></div>
                </div>
              )}

              <div className="backup-details">
                <div className="backup-detail-row">
                  <span className="backup-detail-label">Duration:</span>
                  <span className="backup-detail-value">{item.duration}</span>
                </div>
                <div className="backup-detail-row">
                  <span className="backup-detail-label">Compression:</span>
                  <span className="backup-detail-value">{item.compression}</span>
                </div>
                {item.filePath && (
                  <div className="backup-detail-row">
                    <span className="backup-detail-label">File:</span>
                    <span className="backup-detail-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                      {item.filePath}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BackupDashboard
