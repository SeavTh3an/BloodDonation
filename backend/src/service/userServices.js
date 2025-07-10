import { client } from "../config/db.js";

export const getAllUsers = async () => {
    try {
        const query = "SELECT * FROM pg_user;";
        const result = await client.query(query);
        console.log("Fetched users:", result.rows);
        return result.rows;
    }catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const createUser = async (user, password) => {
    try {
        const query = `CREATE USER ${user} WITH PASSWORD ${password};`
        const result = await client.query(query);
        return result;
    }catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
export const deleteUser = async (user) => {
    try {
        const query = `DROP USER ${user};`
        const result = await client.query(query);
        return result;
    }
    catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export const updateUserStatus = async (user, status) => {
    try {
        if (status === 'Inactive') {
            // Disable user by revoking login privilege
            const query = `ALTER USER ${user} NOLOGIN;`
            const result = await client.query(query);
            console.log(`User ${user} disabled (NOLOGIN)`);
            return result;
        } else {
            // Enable user by granting login privilege
            const query = `ALTER USER ${user} LOGIN;`
            const result = await client.query(query);
            console.log(`User ${user} enabled (LOGIN)`);
            return result;
        }
    } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
    }
}
