import { client } from "../config/db.js";

export const getAllUsers = async () => {
    try {
        const query = "SELECT * FROM pg_user;";
        const result = await client.query(query);
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
