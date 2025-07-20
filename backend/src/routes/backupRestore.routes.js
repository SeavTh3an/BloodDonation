import express from 'express'
import { backupDatabaseCon, getBackupInfoCon, getAllBackupsCon, getCurrentDatabaseInfoCon, downloadBackupFileCon } from '../controller/backupController.js'
import { restoreDatabaseCon, uploadAndRestoreDatabaseCon } from '../controller/restoreController.js'
import multer from 'multer'

export const router = express.Router()

// Multer setup for .sql files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/backups/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/sql' || file.originalname.endsWith('.sql')) {
      cb(null, true)
    } else {
      cb(new Error('Only .sql files are allowed!'))
    }
  }
})

router.post('/backup', backupDatabaseCon)
router.get('/backup/all', getAllBackupsCon)
router.get('/backup/info', getBackupInfoCon) // Default route for getting backup info
router.get('/backup/:fileName', getBackupInfoCon) // Route with filename parameter
router.get('/backup/download/:fileName', downloadBackupFileCon) // Route for downloading backup files
router.get('/database/info', getCurrentDatabaseInfoCon) // Route for getting current database info
router.post('/restore', restoreDatabaseCon)
router.post('/restore/upload', upload.single('backup'), uploadAndRestoreDatabaseCon)