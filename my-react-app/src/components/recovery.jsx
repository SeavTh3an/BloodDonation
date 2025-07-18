"use client"

import { useState } from "react"
import { backupApi } from "../api/backupApi.js"
import "../styles/recovery.css"
import React from "react";

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
  const [recoveryData, setRecoveryData] = useState([])
  const [isRecoveryRunning, setIsRecoveryRunning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useState(null)[0] || useState(() => React.createRef())[0];

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

  // New: handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.sql')) {
      setError('Please select a .sql backup file.');
      return;
    }
    setIsRecoveryRunning(true);
    setError("");
    setSuccess("");
    const newRecovery = {
      id: Date.now(),
      type: "Recovery",
      lastAction: formatCurrentTime(),
      status: "Processing",
      progress: 0,
      isProcessing: true,
    };
    setRecoveryData([newRecovery]);
    try {
      const formData = new FormData();
      formData.append('backup', file);
      // Call backend restore API (assume POST /api/restore/upload)
      const response = await fetch('/api/restore/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Recovery failed');
      setRecoveryData((prev) =>
        prev.map((item) =>
          item.id === newRecovery.id
            ? { ...item, status: "Completed", progress: 100, isProcessing: false }
            : item
        )
      );
      setSuccess("Database recovery completed successfully!");
    } catch (error) {
      setRecoveryData((prev) =>
        prev.map((item) =>
          item.id === newRecovery.id
            ? { ...item, status: "Failed", isProcessing: false }
            : item
        )
      );
      setError("Recovery failed. Please try again.");
    } finally {
      setIsRecoveryRunning(false);
    }
  };

  // New: trigger file input
  const handleRecoveryClick = () => {
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
      fileInputRef.current.click();
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <button className="recovery-button" onClick={handleRecoveryClick} disabled={isRecoveryRunning}>
          {isRecoveryRunning ? "Recovery in Progress..." : "Recovery"}
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          accept=".sql"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}

      <div className="cards-grid">
        {recoveryData.length === 0 ? (
          <div className="no-recoveries" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No recoveries performed yet. Click "Recovery" to restore the database.
          </div>
        ) : (
          recoveryData.map((item) => (
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
          ))
        )}
      </div>
    </div>
  )
}

export default RecoveryDashboard
