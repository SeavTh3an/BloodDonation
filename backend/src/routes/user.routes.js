import express from 'express'
import { getAllUsersCon, createUserCon, deleteUserCon } from '../controller/userController.js'
import { Router } from 'express'

export const userRouter = Router();


userRouter.get("/users", getAllUsersCon)
userRouter.post("/users", createUserCon)
userRouter.delete("/users/:user", deleteUserCon)