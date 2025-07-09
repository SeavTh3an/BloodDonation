import { client } from "../config/db.js";

export const getAllRoles = async () => {
    try {
        const query = "SELECT * FROM pg_roles;";
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}

export const createRole = async (roleName) => {
    try {
        const query = `CREATE ROLE ${roleName};`
        const result = await client.query(query);
        return result;
    }catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}
export const deleteRole = async (roleName) => {
    try {
        const query = `DROP ROLE ${roleName};`
        const result = await client.query(query);
        return result;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
}

export const assignRoleToUser = async (roleName, userName) => {
    try {
        const query = `GRANT ${roleName} TO ${userName};`
        const result = await client.query(query);
        return result;
    }catch (error) {
        console.error("Error assigning role to user:", error);
        throw error;
    }
}

export const revokeRoleFromUser = async (roleName, userName) => {
    try {
        const query = `REVOKE ${roleName} FROM ${userName};`
        const result = await client.query(query);
        return result;
    }
    catch (error) {
        console.error("Error revoking role from user:", error);
        throw error;
    }
}

export const grantPermissionsToRole = async (roleName, permissions) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        const query = `GRANT ${perms} TO ${roleName};`;
        const result = await client.query(query);
        return result;
    }
    catch (error) {
        console.error("Error granting permissions to role:", error);
        throw error;
    }
}
export const revokePermissionsFromRole = async (roleName, permissions) => {
    try {
        const perms = Array.isArray(permissions) ? permissions.join(', ') : permissions;
        const query = `REVOKE ${perms} FROM ${roleName};`
        const result = await client.query(query);
        return result;
    }
    catch (error) {
        console.error("Error revoking permissions from role:", error);
        throw error;
    }
}