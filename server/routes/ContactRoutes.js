import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {  SearchContact } from "../controllers/ContactControlle.js";


const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, SearchContact)
// contactRoutes.get("/get-contact-for-dm", GetContactForDMList)


export default contactRoutes;
