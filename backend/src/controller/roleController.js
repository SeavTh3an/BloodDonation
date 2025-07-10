import { createRole, getAllRoles, deleteRole, assignRoleToUser, grantPermissionsToRole, revokePermissionsFromRole, revokeRoleFromUser } from "../service/roleServices.js";

export const getAllRolesCon = async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.status(200).json(roles);
    }
    catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createRoleCon = async (req, res) => {
    const { roleName } = req.body;
    try {
        const result = await createRole(roleName);
        res.status(201).json({ message: "Role created successfully", result });
    }catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteRoleCon = async (req, res) => {
    const { roleName } = req.params;
    try {
        const result = await deleteRole(roleName);
        res.status(200).json({ message: "Role deleted successfully", result });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const assignRoleToUserCon = async (req, res) => {
    const { userId, roleName } = req.body;
    try {
        const result = await assignRoleToUser(userId, roleName);
        res.status(200).json({ message: "Role assigned successfully", result });
    } catch (error) {
        console.error("Error assigning role to user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const grantPermissionsToRoleCon = async (req, res) => {
    const { roleName, permissions } = req.body;
    try {
        const result = await grantPermissionsToRole(roleName, permissions);
        res.status(200).json({ message: "Permissions granted successfully", result });
    } catch (error) {
        console.error("Error granting permissions to role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const revokePermissionsFromRoleCon = async (req, res) => {
    const { roleName, permissions } = req.body;
    try {
        const result = await revokePermissionsFromRole(roleName, permissions);
        res.status(200).json({ message: "Permissions revoked successfully", result });
    } catch (error) {
        console.error("Error revoking permissions from role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const revokeRoleFromUserCon = async (req, res) => {
    const { userId, roleName } = req.body;
    try {
        const result = await revokeRoleFromUser(userId, roleName);
        res.status(200).json({ message: "Role revoked successfully", result });
    } catch (error) {
        console.error("Error revoking role from user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}