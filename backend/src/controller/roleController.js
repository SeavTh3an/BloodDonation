import { createRole, getAllRoles, deleteRole, assignRoleToUser, grantPermissionsToRole, revokePermissionsFromRole, revokeRoleFromUser } from "../service/roleServices";

export const getAllRoles = async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.status(200).json(roles);
    }
    catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const result = await createRole(roleName);
        res.status(201).json({ message: "Role created successfully", result });
    }catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteRole = async (req, res) => {
    const { roleName } = req.params;
    try {
        const result = await deleteRole(roleName);
        res.status(200).json({ message: "Role deleted successfully", result });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}