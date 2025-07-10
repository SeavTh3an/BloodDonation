import { createRole, getAllRoles, deleteRole, assignRoleToUser, grantPermissionsToRole, revokePermissionsFromRole, revokeRoleFromUser, getUserRoles, getRolePermissions, getUsersWithRole, revokeRoleFromAllUsers } from "../service/roleServices.js";

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
        console.log(`Attempting to delete role: ${roleName}`);
        const result = await deleteRole(roleName);
        res.status(200).json({ message: `Role ${roleName} deleted successfully` });
    } catch (error) {
        console.error("Error deleting role:", error);
        
        // Check for specific error types
        let errorMessage = "Failed to delete role";
        if (error.message.includes("cannot be dropped")) {
            errorMessage = `Cannot delete role "${roleName}" because it is still assigned to users or has dependencies. Please remove all users from this role first.`;
        } else if (error.message.includes("does not exist")) {
            errorMessage = `Role "${roleName}" does not exist.`;
        } else {
            errorMessage = `Failed to delete role: ${error.message}`;
        }
        
        res.status(500).json({ error: errorMessage, detail: error.message });
    }
}

export const assignRoleToUserCon = async (req, res) => {
    const { roleName, userName } = req.body;
    try {
        const result = await assignRoleToUser(roleName, userName);
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

export const getUserRolesCon = async (req, res) => {
    const { userName } = req.params;
    try {
        const roles = await getUserRoles(userName);
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error getting user roles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getRolePermissionsCon = async (req, res) => {
    const { roleName } = req.params;
    try {
        console.log(`Controller: Getting permissions for role: ${roleName}`)
        const permissions = await getRolePermissions(roleName);
        res.status(200).json(permissions);
    } catch (error) {
        console.error("Error getting role permissions:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}

export const testRolesCon = async (req, res) => {
    try {
        console.log("Testing role fetching...")
        const roles = await getAllRoles();
        res.status(200).json({ 
            message: "Roles fetched successfully", 
            count: roles.length, 
            roles: roles 
        });
    } catch (error) {
        console.error("Error testing roles:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}

export const getUsersWithRoleCon = async (req, res) => {
    const { roleName } = req.params;
    try {
        console.log(`Getting users with role: ${roleName}`);
        const users = await getUsersWithRole(roleName);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users with role:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}

export const revokeRoleFromAllUsersCon = async (req, res) => {
    const { roleName } = req.params;
    try {
        console.log(`Revoking role ${roleName} from all users`);
        const result = await revokeRoleFromAllUsers(roleName);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error revoking role from all users:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}