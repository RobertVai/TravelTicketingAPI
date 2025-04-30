import express from "express";
import {
  NEW_USER,
  GET_USERS,
  GET_USER_BY_ID
} from "../controllers/userController.js";

const router = express.Router();

router.post("/newUser", NEW_USER); 
router.get("/", GET_USERS);        
router.get("/:id", GET_USER_BY_ID); 

export default router;