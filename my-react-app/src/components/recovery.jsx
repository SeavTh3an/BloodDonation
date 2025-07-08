"use client"

import { useState } from "react"
import "../styles/recovery.css"

const FolderIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
)

const CloudIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const RecoveryDashboard = () => {
  const [recoveryData, setRecoveryData] = useState([
    {
      id: 1,
      type: "Recovery",
      lastAction: "last recovery yesterday 22:22 AM",
      status: "Pending",
      progress: 0,
      isProcessing: false,
    },
    {
      id: 2,
      type: "Recovery",
      lastAction: "last recovery 2023-10-04 11:11 AM",
      status: "Completed",
      progress: 100,
      isProcessing: false,
    },
    {
      id: 3,
      type: "Recovery",
      lastAction: "last recovery 2020-12-31 11:11 AM",
      status: "Completed",
      progress: 100,
      isProcessing: false,
    },
    {
      id: 4,
      type: "Backup",
      lastAction: "last backup 2015-01-01 11:11 AM",
      status: "Completed",
      progress: 100,
      isProcessing: false,
    },
  ])

  const [isRecoveryRunning, setIsRecoveryRunning] = useState(false)

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Completed":
        return "status-completed"
      case "Processing":
        return "status-processing"
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
    return `last recovery ${now.toLocaleDateString("en-US", options)}`
  }

  const startRecovery = () => {
    setIsRecoveryRunning(true)

    // Find the first pending recovery item
    const pendingIndex = recoveryData.findIndex((item) => item.status === "Pending")

    if (pendingIndex !== -1) {
      // Update the item to processing state
      setRecoveryData((prev) =>
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

      // Simulate recovery progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5 // Random progress between 5-20%

        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Mark as completed
          setRecoveryData((prev) =>
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

          setIsRecoveryRunning(false)
        } else {
          // Update progress
          setRecoveryData((prev) =>
            prev.map((item, index) => (index === pendingIndex ? { ...item, progress: Math.min(progress, 100) } : item)),
          )
        }
      }, 800)
    }
  }

  return (
    <div className="dashboard">
      <div className="header">
        <button className="recovery-button" onClick={startRecovery} disabled={isRecoveryRunning}>
          {isRecoveryRunning ? "Recovery in Progress..." : "Recovery"}
        </button>
      </div>

      <div className="cards-grid">
        {recoveryData.map((item) => (
          <div key={item.id} className={`card ${item.isProcessing ? "processing pulse" : ""}`}>
            <div className="card-header">
              <h2 className="card-title">{item.type}</h2>
              <p className="card-subtitle">{item.lastAction}</p>
            </div>

            <div className="card-content">
              <div className="column">
                <FolderIcon />
                <p className="column-label">Source</p>
                <p className="column-value">168.88GB</p>
              </div>

              <div className="column">
                <CloudIcon />
                <p className="column-label">Backup</p>
                <p className="column-value">168.88GB</p>
              </div>

              <div className="column">
                <ClockIcon />
                <p className="column-label">Status</p>
                <p className={`column-value ${getStatusClass(item.status)}`}>
                  {item.status === "Processing" ? (
                    <span className="processing-indicator">
                      <span className="spinner"></span>
                      Processing
                    </span>
                  ) : (
                    item.status
                  )}
                </p>
              </div>
            </div>

            {item.isProcessing && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecoveryDashboard
