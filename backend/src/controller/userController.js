import { getAllUsers, createUser, deleteUser, updateUserStatus } from "../service/userServices.js";

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