import { spawn } from 'child_process'
import { mkdirSync, statSync, existsSync } from 'fs'
import { dirname } from 'path'

export function backupPostgres({ host, port, user, password, dbName, outputFile }) {
  mkdirSync(dirname(outputFile), { recursive: true })

  const env = { ...process.env, PGPASSWORD: password }
  const args = [
    `--host=${host}`,
    `--port=${port}`,
    `--username=${user}`,
    `--dbname=${dbName}`,
    `--file=${outputFile}`,
  ]

  return new Promise((resolve, reject) => {
    const dump = spawn('pg_dump', args, { env })

    dump.on('close', (code) => {
      if (code === 0) {
        // Get file information after successful backup
        try {
          const fileStats = statSync(outputFile)
          const fileSizeInBytes = fileStats.size
          const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2)
          
          const backupInfo = {
            message: `Backup successful. File saved as ${outputFile}`,
            filePath: outputFile,
            fileName: outputFile.split('/').pop(),
            fileSize: `${fileSizeInMB} MB`,
            fileSizeBytes: fileSizeInBytes,
            createdAt: fileStats.birthtime,
            modifiedAt: fileStats.mtime,
            exists: true
          }
          
          resolve(backupInfo)
        } catch (statError) {
          console.error('Error getting file stats:', statError)
          resolve({
            message: `Backup successful. File saved as ${outputFile}`,
            filePath: outputFile,
            fileName: outputFile.split('/').pop(),
            fileSize: 'Unknown',
            fileSizeBytes: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            exists: false
          })
        }
      } else {
        reject(new Error(`Backup failed with exit code ${code}`))
      }
    })
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
      fileName: outputFile.split('/').pop(),
      fileSize: `${fileSizeInMB} MB`,
      fileSizeBytes: fileSizeInBytes,
      createdAt: fileStats.birthtime,
      modifiedAt: fileStats.mtime,
      message: 'Backup file found'
    }
  } catch (error) {
    console.error('Error getting backup info:', error)
    return {
      exists: false,
      message: 'Error reading backup file',
      error: error.message
    }
  }
}