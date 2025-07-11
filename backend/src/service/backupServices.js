import { spawn } from 'child_process'
import { mkdirSync, statSync, existsSync, readdirSync } from 'fs'
import path from 'path'

// Backup types enum
export const BackupType = {
  FULL: 'FULL'
}

export function generateBackupFileName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `blood_backup_full_${timestamp}.sql`
}

export function backupPostgres({ host, port, user, password, dbName }) {
  return new Promise((resolve, reject) => {
    try {
      // Ensure backup directory exists
      const backupDir = path.resolve('./src/backups')
      mkdirSync(backupDir, { recursive: true })

      const outputFile = path.join(backupDir, generateBackupFileName())
      console.log('Backup path:', outputFile)

      const env = { ...process.env, PGPASSWORD: password }
      const args = [
        `-h`, host,
        `-p`, port,
        `-U`, user,
        `-d`, dbName,
        `-f`, outputFile,
        `-v`, // Verbose output
        `--no-owner`,
        `--no-acl`
      ]

      console.log('Running pg_dump with args:', args.join(' '))
      const dump = spawn('pg_dump', args, { env })

      let errorOutput = ''
      
      dump.stdout.on('data', (data) => {
        console.log('pg_dump output:', data.toString())
      })

      dump.stderr.on('data', (data) => {
        errorOutput += data.toString()
        console.error('pg_dump error:', data.toString())
      })

      dump.on('close', (code) => {
        if (code === 0) {
          try {
            const backupInfo = getBackupInfo(outputFile)
            console.log('Backup completed successfully:', backupInfo)
            resolve(backupInfo)
          } catch (statError) {
            console.error('Error getting file stats:', statError)
            reject(new Error(`Backup failed: ${statError.message}`))
          }
        } else {
          console.error('pg_dump failed with code:', code)
          reject(new Error(`Backup failed with exit code ${code}. Error: ${errorOutput}`))
        }
      })

      dump.on('error', (error) => {
        console.error('Failed to start pg_dump:', error)
        reject(new Error(`Failed to start backup process: ${error.message}`))
      })

    } catch (error) {
      console.error('Error in backupPostgres:', error)
      reject(new Error(`Backup failed: ${error.message}`))
    }
  })
}

export function getBackupInfo(outputFile) {
  try {
    if (!existsSync(outputFile)) {
      return {
        exists: false,
        message: 'Backup file not found'
      }
    }

    const fileStats = statSync(outputFile)
    const fileSizeInBytes = fileStats.size
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2)
    
    return {
      exists: true,
      filePath: outputFile,
      fileName: path.basename(outputFile),
      fileSize: `${fileSizeInMB} MB`,
      fileSizeBytes: fileSizeInBytes,
      createdAt: fileStats.birthtime,
      modifiedAt: fileStats.mtime,
      message: 'Backup file found'
    }
  } catch (error) {
    console.error('Error getting backup info:', error)
    throw error
  }
}

export function getAllBackups() {
  const backupDir = path.resolve('./src/backups')
  try {
    if (!existsSync(backupDir)) {
      return []
    }

    const files = readdirSync(backupDir)
    return files
      .filter(file => file.startsWith('blood_backup_full_') && file.endsWith('.sql'))
      .map(file => getBackupInfo(path.join(backupDir, file)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error getting all backups:', error)
    return []
  }
}

export function getBackupStats() {
  const backups = getAllBackups()
  const totalSizeBytes = backups.reduce((sum, backup) => sum + backup.fileSizeBytes, 0)
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2)
  
  return {
    totalBackups: backups.length,
    totalSize: `${totalSizeMB} MB`,
    lastBackup: backups.length > 0 ? backups[0].createdAt : null,
    backups: backups
  }
}