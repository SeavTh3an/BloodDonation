import { spawn } from 'child_process'
import { mkdirSync } from 'fs'
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
        resolve(`Backup successful. File saved as ${outputFile}`)
      } else {
        reject(new Error(`Backup failed with exit code ${code}`))
      }
    })
  })
}