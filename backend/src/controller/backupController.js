import { backupPostgres } from '../service/backupServices.js'

export const backupDatabaseCon = async (req, res) => {
  try {
    const message = await backupPostgres({
      host: 'centerbeam.proxy.rlwy.net',
      port: '43047',
      user: 'postgres',
      password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
      dbName: 'blood_donation_system',
      outputFile: './backups/blood_backup.sql',
    })

    res.status(200).json({ message })
  } catch (error) {
    console.error('Backup failed:', error)
    res.status(500).json({ error: 'Backup failed', detail: error.message })
  }
}