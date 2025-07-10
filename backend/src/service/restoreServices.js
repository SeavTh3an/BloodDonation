import { spawn } from "child_process"
import fs from "fs"

export function restorePostgres({ host, port, user, password, dbName, inputFile }) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, PGPASSWORD: password }

    const args = [
      `--host=${host}`,
      `--port=${port}`,
      `--username=${user}`,
      dbName,
    ]

    const restore = spawn("psql", args, { env })

    const readStream = fs.createReadStream(inputFile)
    readStream.pipe(restore.stdin)

    restore.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`)
    })

    restore.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`)
    })

    restore.on("close", (code) => {
      if (code === 0) {
        resolve(`Restore completed successfully from ${inputFile}`)
      } else {
        reject(new Error(`Restore failed with exit code ${code}`))
      }
    })
  })
}