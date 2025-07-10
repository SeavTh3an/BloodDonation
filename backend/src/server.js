import express, {json} from "express";
import cors from "cors";
import { roleRouter } from "./routes/role.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { BRrouter } from "./routes/backupRestore.routes.js";

const app = express();
app.use(cors());
app.use(json());
app.use('/api', roleRouter);
app.use('/api', userRouter);
app.use('/api', BRrouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});