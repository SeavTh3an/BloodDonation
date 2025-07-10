import express from "express"
import { Router } from "express"
import {
  getAllRolesCon,
  createRoleCon,
  deleteRoleCon,
  assignRoleToUserCon,
  grantPermissionsToRoleCon,
  revokePermissionsFromRoleCon,
  revokeRoleFromUserCon,
} from "../controller/roleController.js"

export const roleRouter = Router()

roleRouter.get("/roles", getAllRolesCon)
roleRouter.post("/roles", createRoleCon)
roleRouter.delete("/roles/:roleName", deleteRoleCon)
roleRouter.post("/roles/assign", assignRoleToUserCon)
roleRouter.post("/roles/permissions/grant", grantPermissionsToRoleCon)
roleRouter.post("/roles/permissions/revoke", revokePermissionsFromRoleCon)
roleRouter.post("/roles/revoke", revokeRoleFromUserCon)

