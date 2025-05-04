import express from "express";
import {
  NEW_USER,
  GET_USERS,
  GET_USER_BY_ID,
  SIGN_IN,
  GET_NEW_JWT_TOKEN,
  GET_AUTH_USERS,
  PURCHASE_TICKET,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS
  
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";


const router = express.Router();

router.post("/newUser", NEW_USER); 
router.get("/", GET_USERS);        
router.get("/getUserById", authUser, GET_USER_BY_ID);
router.post("/signIn", SIGN_IN);
router.post("/getNewJwtToken", GET_NEW_JWT_TOKEN);
router.get("/getAuthUsers", authUser, GET_AUTH_USERS );
router.post("/purchaseTicket/:ticketId", authUser, PURCHASE_TICKET);
router.get("/getAllUsersWithTickets", authUser, GET_ALL_USERS_WITH_TICKETS);
router.get("/getUserByIdWithTickets", authUser, GET_USER_BY_ID_WITH_TICKETS);

export default router;