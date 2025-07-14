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
  getUserRolesCon,
  getRolePermissionsCon,
  testRolesCon,
  getUsersWithRoleCon,
  revokeRoleFromAllUsersCon,
  grantPermissionsToUserCon,
  revokePermissionsFromUserCon,
} from "../controller/roleController.js"

export const roleRouter = Router()

roleRouter.get("/roles", getAllRolesCon)
roleRouter.post("/roles", createRoleCon)
roleRouter.delete("/roles/:roleName", deleteRoleCon)
roleRouter.post("/roles/assign", assignRoleToUserCon)
roleRouter.post("/roles/permissions/grant", grantPermissionsToRoleCon)
roleRouter.post("/roles/permissions/revoke", revokePermissionsFromRoleCon)
roleRouter.post("/roles/revoke", revokeRoleFromUserCon)
roleRouter.get("/roles/user/:userName", getUserRolesCon)
roleRouter.get("/roles/:roleName/permissions", getRolePermissionsCon)
roleRouter.get("/roles/test", testRolesCon)
roleRouter.get("/roles/:roleName/users", getUsersWithRoleCon)
roleRouter.post("/roles/:roleName/revoke-all", revokeRoleFromAllUsersCon)
roleRouter.post("/users/permissions/grant", grantPermissionsToUserCon)
roleRouter.post("/users/permissions/revoke", revokePermissionsFromUserCon)

