import Joi from "joi";

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "You have provided a bad data",
        error: error.details
      });
    }

    return next();
  };
};

const newUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(/\d/).required(),
  money_balance: Joi.number().min(0).optional()
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


const ticketPurchaseSchema = Joi.object({
  userId: Joi.string().required()
});

const jwtRefreshSchema = Joi.object({
  jwt_refresh_token: Joi.string().required()
});

const userIdParamSchema = Joi.object({
  userId: Joi.string().required()
});

const getUserByIdSchema = Joi.object({
  userId: Joi.string().required()
});

export default validate;

export {
  newUserSchema,
  signInSchema,
  ticketPurchaseSchema,
  jwtRefreshSchema,
  userIdParamSchema,
  getUserByIdSchema
 };
