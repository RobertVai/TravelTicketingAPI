import express from "express";
import {
  NEW_USER,
  GET_USERS,
  GET_USER_BY_ID,
  SIGN_IN,
  GET_NEW_JWT_TOKEN,
  GET_AUTH_USERS
  
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";


const router = express.Router();

router.post("/newUser", NEW_USER); 
router.get("/", GET_USERS);        
router.get("/getUserById", authUser, GET_USER_BY_ID);
router.post("/signIn", SIGN_IN);
router.post("/getNewJwtToken", GET_NEW_JWT_TOKEN);
router.get("/getAuthUsers", authUser, GET_AUTH_USERS );


export default router;