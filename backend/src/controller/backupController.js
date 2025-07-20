import { backupPostgres, getBackupInfo, getAllBackups, getBackupStats, BackupType, getCurrentDatabaseInfo } from '../service/backupServices.js'
import path from 'path'
import fs from 'fs'

export const backupDatabaseCon = async (req, res) => {
  try {
    console.log('Starting backup')
    const backupInfo = await backupPostgres({
      host: 'centerbeam.proxy.rlwy.net',
      port: '43047',
      user: 'postgres',
      password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
      dbName: 'blood_donation_system'
    })

    res.status(200).json(backupInfo)
  } catch (error) {
    console.error('Backup failed:', error)
    res.status(500).json({ 
      error: 'Backup failed', 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

export const getBackupInfoCon = async (req, res) => {
  try {
    const { fileName } = req.params
    let backupPath

    // If accessing /backup/info endpoint
    if (!fileName) {
      const stats = getBackupStats()
      res.status(200).json(stats)
      return
    }
    
    // If accessing /backup/:fileName endpoint
    backupPath = path.resolve('./src/backups', fileName)
    console.log('Getting backup info for:', backupPath)
    const backupInfo = getBackupInfo(backupPath)
    res.status(200).json(backupInfo)
  } catch (error) {
    console.error('Error getting backup info:', error)
    res.status(500).json({ 
      error: 'Failed to get backup info', 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

export const downloadBackupFileCon = async (req, res) => {
  try {
    const { fileName } = req.params
    const backupPath = path.resolve('./src/backups', fileName)
    
    // Check if file exists
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Backup file not found' })
    }
    
    // Check if it's a valid backup file
    if (!fileName.startsWith('blood_backup_full_') || !fileName.endsWith('.sql')) {
      return res.status(400).json({ error: 'Invalid backup file' })
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/sql')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    
    // Stream the file
    const fileStream = fs.createReadStream(backupPath)
    fileStream.pipe(res)
    
  } catch (error) {
    console.error('Error downloading backup file:', error)
    res.status(500).json({ 
      error: 'Failed to download backup file', 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

export const getAllBackupsCon = async (req, res) => {
  try {
    console.log('Getting all backups')
    const stats = getBackupStats()
    res.status(200).json(stats)
  } catch (error) {
    console.error('Error getting all backups:', error)
    res.status(500).json({ 
      error: 'Failed to get all backups', 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

export const getCurrentDatabaseInfoCon = async (req, res) => {
  try {
    console.log('Getting current database info')
    const dbInfo = await getCurrentDatabaseInfo({
      host: 'centerbeam.proxy.rlwy.net',
      port: '43047',
      user: 'postgres',
      password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
      dbName: 'blood_donation_system'
    })
    res.status(200).json(dbInfo)
  } catch (error) {
    console.error('Error getting current database info:', error)
    res.status(500).json({ 
      error: 'Failed to get current database info', 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}