import { backupPostgres, getBackupInfo } from '../service/backupServices.js'

export const backupDatabaseCon = async (req, res) => {
  try {
    const backupInfo = await backupPostgres({
      host: 'centerbeam.proxy.rlwy.net',
      port: '43047',
      user: 'postgres',
      password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
      dbName: 'blood_donation_system',
      outputFile: './backups/blood_backup.sql',
    })

    res.status(200).json(backupInfo)
  } catch (error) {
    console.error('Backup failed:', error)
    res.status(500).json({ error: 'Backup failed', detail: error.message })
  }
}

export const getBackupInfoCon = async (req, res) => {
  try {
    const backupInfo = getBackupInfo('./backups/blood_backup.sql')
    res.status(200).json(backupInfo)
  } catch (error) {
    console.error('Error getting backup info:', error)
    res.status(500).json({ error: 'Failed to get backup info', detail: error.message })
  }
}