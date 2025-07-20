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

export function getCurrentDatabaseInfo({ host, port, user, password, dbName }) {
  return new Promise((resolve, reject) => {
    try {
      const env = { ...process.env, PGPASSWORD: password }
      
      // Query to get database size
      const sizeQuery = `
        SELECT 
          pg_size_pretty(pg_database_size('${dbName}')) as size,
          pg_database_size('${dbName}') as size_bytes
      `
      
      // Query to get table count
      const tableQuery = `
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      
      // Query to get last modified date (approximate)
      const lastModifiedQuery = `
        SELECT MAX(last_modified) as last_modified
        FROM (
          SELECT GREATEST(
            COALESCE(MAX(last_vacuum), '1970-01-01'),
            COALESCE(MAX(last_autovacuum), '1970-01-01'),
            COALESCE(MAX(last_analyze), '1970-01-01'),
            COALESCE(MAX(last_autoanalyze), '1970-01-01')
          ) as last_modified
          FROM pg_stat_user_tables
        ) as stats
      `

      const psql = spawn('psql', [
        `-h`, host,
        `-p`, port,
        `-U`, user,
        `-d`, dbName,
        `-t`, // Tuples only
        `-c`, `${sizeQuery}; ${tableQuery}; ${lastModifiedQuery}`
      ], { env })

      let output = ''
      let errorOutput = ''

      psql.stdout.on('data', (data) => {
        output += data.toString()
      })

      psql.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      psql.on('close', (code) => {
        if (code === 0) {
          try {
            const lines = output.trim().split('\n').filter(line => line.trim())
            const sizeLine = lines[0] || ''
            const tableLine = lines[1] || ''
            const modifiedLine = lines[2] || ''

            const sizeMatch = sizeLine.match(/(\d+(?:\.\d+)?)\s+(\w+)/)
            const tableMatch = tableLine.match(/(\d+)/)
            const modifiedMatch = modifiedLine.match(/(\d{4}-\d{2}-\d{2})/)

            const size = sizeMatch ? `${sizeMatch[1]} ${sizeMatch[2]}` : 'Unknown'
            const tables = tableMatch ? `${tableMatch[1]} tables` : 'Unknown'
            const lastModified = modifiedMatch ? new Date(modifiedMatch[1]).toLocaleString() : 'Unknown'

            resolve({
              size,
              tables,
              lastModified,
              sizeBytes: sizeMatch ? parseInt(sizeMatch[1]) * (sizeMatch[2] === 'MB' ? 1024 * 1024 : 1024) : 0
            })
          } catch (parseError) {
            console.error('Error parsing database info:', parseError)
            resolve({
              size: 'Unknown',
              tables: 'Unknown',
              lastModified: 'Unknown',
              sizeBytes: 0
            })
          }
        } else {
          console.error('psql failed with code:', code, 'Error:', errorOutput)
          // Return default values if query fails
          resolve({
            size: 'Unknown',
            tables: 'Unknown',
            lastModified: 'Unknown',
            sizeBytes: 0
          })
        }
      })

      psql.on('error', (error) => {
        console.error('Failed to start psql:', error)
        reject(new Error(`Failed to get database info: ${error.message}`))
      })

    } catch (error) {
      console.error('Error in getCurrentDatabaseInfo:', error)
      reject(new Error(`Failed to get database info: ${error.message}`))
    }
  })
}