import express, {Router} from 'express'
import { restoreDatabaseCon } from '../controller/restoreController.js'
import { backupDatabaseCon } from '../controller/backupController.js'

export const BRrouter = Router();

BRrouter.post('/restore', restoreDatabaseCon);
BRrouter.post('/backup', backupDatabaseCon);