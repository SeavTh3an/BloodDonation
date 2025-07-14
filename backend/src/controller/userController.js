import { getAllUsers, createUser, deleteUser, updateUserStatus } from "../service/userServices.js";
import { getRolePermissions, getUserRoles } from "../service/roleServices.js";

export const getAllUsersCon = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createUserCon = async (req, res) => {
    const { user, password } = req.body;
    try {
        const result = await createUser(user, password);
        res.status(201).json({ message: "User created successfully", result });
    }catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const deleteUserCon = async (req, res) => {
    const { user } = req.params;
    try {
        const result = await deleteUser(user);
        res.status(200).json({ message: "User deleted successfully", result });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserStatusCon = async (req, res) => {
    const { user } = req.params;
    const { status } = req.body;
    try {
        const result = await updateUserStatus(user, status);
        res.status(200).json({ message: "User status updated successfully", result });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserPermissionsCon = async (req, res) => {
    const { user } = req.params;
    try {
        // getRolePermissions works for both users and roles in Postgres
        const permissions = await getRolePermissions(user);
        res.status(200).json(permissions);
    } catch (error) {
        console.error("Error getting user permissions:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}

export const getAllUserDetailsCon = async (req, res) => {
    try {
        const users = await getAllUsers();
        const userDetails = await Promise.all(users.map(async user => {
            const username = user.usename || user.username || 'Unknown';
            let roles = [];
            let permissions = [];
            try {
                const rolesData = await getUserRoles(username);
                roles = rolesData.map(r => r.rolname);
            } catch (e) { roles = []; }
            try {
                const permsData = await getRolePermissions(username);
                permissions = (permsData.tables || []).map(p => `${p.tablename}:${p.privilege_type}`);
            } catch (e) { permissions = []; }
            return {
                name: username,
                username,
                roles,
                permissions,
                status: 'Active',
            };
        }));
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
}