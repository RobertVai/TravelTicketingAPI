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
import validate, {
  getUserByIdSchema,
  jwtRefreshSchema,
  newUserSchema,
  signInSchema,
  ticketPurchaseSchema,
  userIdParamSchema

} from "../middleware/validation.js";


const router = express.Router();

router.post("/newUser", validate(newUserSchema), NEW_USER); 
router.post("/signIn", validate(signInSchema), SIGN_IN);
router.post("/getNewJwtToken", validate(jwtRefreshSchema), GET_NEW_JWT_TOKEN);
router.post("/purchaseTicket/:ticketId", authUser, validate(ticketPurchaseSchema), PURCHASE_TICKET);
router.get("/", GET_USERS);        
router.get("/getUserById", authUser, validate(getUserByIdSchema), GET_USER_BY_ID);
router.get("/getAuthUsers", authUser, GET_AUTH_USERS );
router.get("/getAllUsersWithTickets", authUser, GET_ALL_USERS_WITH_TICKETS);
router.get("/getUserByIdWithTickets", authUser, validate(userIdParamSchema), GET_USER_BY_ID_WITH_TICKETS);

export default router;