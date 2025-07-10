import { restorePostgres } from "../service/restoreServices.js"

export const restoreDatabaseCon = async (req, res) => {
  try {
    // You can pass these values dynamically or hard-code them here
    const message = await restorePostgres({
      host: "centerbeam.proxy.rlwy.net",
      port: "43047",
      user: "postgres",
      password: "maViAbEfuXfjxAOcgxGTRWnsmZCxCdan",
      dbName: "blood_donation_system",
      inputFile: "./backups/blood_donation_system_backup.sql",
    })

    res.status(200).json({ message })
  } catch (error) {
    console.error("Restore failed:", error)
    res.status(500).json({ error: "Restore failed", detail: error.message })
  }
}