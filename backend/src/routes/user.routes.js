import express from 'express'
import { getAllUsersCon, createUserCon, deleteUserCon, updateUserStatusCon } from '../controller/userController.js'
import { getUserPermissionsCon, getAllUserDetailsCon } from '../controller/userController.js'
import { Router } from 'express'

export const userRouter = Router();


userRouter.get("/users", getAllUsersCon)
userRouter.post("/users", createUserCon)
userRouter.delete("/users/:user", deleteUserCon)
userRouter.put("/users/:user/status", updateUserStatusCon)
userRouter.get("/users/:user/permissions", getUserPermissionsCon)
userRouter.get("/users/details", getAllUserDetailsCon)