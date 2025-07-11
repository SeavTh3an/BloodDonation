import { backupPostgres, getBackupInfo, getAllBackups, getBackupStats, BackupType } from '../service/backupServices.js'
import path from 'path'

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