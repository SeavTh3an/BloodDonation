"use client"

import { useState } from "react"
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
  const [backupData, setBackupData] = useState([
    {
      id: 1,
      name: "Database Backup",
      type: "Full",
      lastAction: "last backup 2024-01-08 14:30 PM",
      status: "Pending",
      progress: 0,
      isProcessing: false,
      sourceSize: "245.67GB",
      backupSize: "245.67GB",
      duration: "45 min",
      compression: "85%",
    },
    {
      id: 2,
      name: "Application Files",
      type: "Incremental",
      lastAction: "last backup 2024-01-08 12:15 PM",
      status: "Completed",
      progress: 100,
      isProcessing: false,
      sourceSize: "89.23GB",
      backupSize: "89.23GB",
      duration: "12 min",
      compression: "78%",
    },
    {
      id: 3,
      name: "User Documents",
      type: "Differential",
      lastAction: "last backup 2024-01-07 18:45 PM",
      status: "Completed",
      progress: 100,
      isProcessing: false,
      sourceSize: "156.44GB",
      backupSize: "156.44GB",
      duration: "28 min",
      compression: "82%",
    },
    {
      id: 4,
      name: "System Configuration",
      type: "Full",
      lastAction: "last backup 2024-01-06 09:20 AM",
      status: "Pending",
      progress: 0,
      isProcessing: false,
      sourceSize: "12.89GB",
      backupSize: "12.89GB",
      duration: "5 min",
      compression: "91%",
    },
  ])

  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [stats, setStats] = useState({
    totalBackups: 4,
    completedBackups: 2,
    totalSize: "504.23GB",
    lastBackup: "2 hours ago",
  })

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

  const startBackup = () => {
    setIsBackupRunning(true)

    // Find the first pending backup item
    const pendingIndex = backupData.findIndex((item) => item.status === "Pending")

    if (pendingIndex !== -1) {
      // Update the item to processing state
      setBackupData((prev) =>
        prev.map((item, index) =>
          index === pendingIndex
            ? {
                ...item,
                status: "Processing",
                isProcessing: true,
                lastAction: formatCurrentTime(),
              }
            : item,
        ),
      )

      // Simulate backup progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 12 + 3 // Random progress between 3-15%

        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Mark as completed and update stats
          setBackupData((prev) =>
            prev.map((item, index) =>
              index === pendingIndex
                ? {
                    ...item,
                    status: "Completed",
                    progress: 100,
                    isProcessing: false,
                  }
                : item,
            ),
          )

          setStats((prev) => ({
            ...prev,
            completedBackups: prev.completedBackups + 1,
            lastBackup: "Just now",
          }))

          setIsBackupRunning(false)
        } else {
          // Update progress
          setBackupData((prev) =>
            prev.map((item, index) => (index === pendingIndex ? { ...item, progress: Math.min(progress, 100) } : item)),
          )
        }
      }, 1000)
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
        {backupData.map((item) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BackupDashboard
