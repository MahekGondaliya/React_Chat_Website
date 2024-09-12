import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

import { GetMessages } from "../controllers/MessageController.js";


const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken, GetMessages)


export default messagesRoutes;
