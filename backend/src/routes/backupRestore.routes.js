import express from 'express'
import { backupDatabaseCon, getBackupInfoCon, getAllBackupsCon } from '../controller/backupController.js'
import { restoreDatabaseCon } from '../controller/restoreController.js'

export const router = express.Router()

router.post('/backup', backupDatabaseCon)
router.get('/backup/all', getAllBackupsCon)
router.get('/backup/info', getBackupInfoCon) // Default route for getting backup info
router.get('/backup/:fileName', getBackupInfoCon) // Route with filename parameter
router.post('/restore', restoreDatabaseCon)