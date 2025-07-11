import express, {json} from "express";
import cors from "cors";
import { roleRouter } from "./routes/role.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { router } from "./routes/backupRestore.routes.js";
import { client } from "./config/db.js";

const app = express();
app.use(cors());
app.use(json());
app.use('/api', roleRouter);
app.use('/api', userRouter);
app.use('/api', router);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Connect to database
client.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    });