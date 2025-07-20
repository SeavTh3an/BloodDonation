"use client"

import { useState } from "react"
import "../styles/recovery.css"
import React from "react";

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

const RecoveryDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isRecoveryRunning, setIsRecoveryRunning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.name.endsWith('.sql')) {
      setError('Please select a .sql backup file.')
      return
    }

    setSelectedFile(file)
    setError("")
    setSuccess("")

    // Automatically start recovery when file is selected
    await performRecovery(file)
  }

  const performRecovery = async (file) => {
    setIsRecoveryRunning(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append('backup', file)
      
      const response = await fetch('/api/restore/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Recovery failed')
      }
      
      const result = await response.json()
      setSuccess(result.message || "Database recovery completed successfully!")
      setSelectedFile(null)
      
    } catch (error) {
      console.error('Recovery failed:', error)
      setError(`Recovery failed: ${error.message}`)
    } finally {
      setIsRecoveryRunning(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div className="header-controls">
          <label className="upload-button">
            {isRecoveryRunning ? "Uploading..." : "Upload Backup File"}
            <input
              type="file"
              accept=".sql"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={isRecoveryRunning}
            />
          </label>
        </div>
      </div>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}

      {/* Selected File Info */}
      {selectedFile && (
        <div className="selected-file-info" style={{
          background: '#f8f9fa',
          padding: '20px',
          marginTop: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
            <CloudIcon /> Selected Backup File
          </h3>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            <div style={{ marginBottom: '5px' }}>
              <strong>File Name:</strong> {selectedFile.name}
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>File Size:</strong> {formatFileSize(selectedFile.size)}
            </div>
            <div>
              <strong>File Type:</strong> {selectedFile.type || 'application/sql'}
            </div>
          </div>
        </div>
      )}

      {/* Recovery Progress */}
      {isRecoveryRunning && (
        <div className="recovery-progress" style={{
          background: '#f8f9fa',
          padding: '20px',
          marginTop: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
            <span className="spinner" style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '10px'
            }}></span>
            Recovery in Progress...
          </h4>
          <div className="progress-bar" style={{
            width: '100%',
            height: '20px',
            background: '#e9ecef',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div className="progress-fill" style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #007bff, #0056b3)',
              animation: 'progress 2s ease-in-out infinite'
            }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecoveryDashboard
