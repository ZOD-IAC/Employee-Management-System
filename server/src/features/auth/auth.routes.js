import express from "express";
import { login } from "./auth.controller.js";
import { loginValidation } from "./auth.validation.js";
import { validate } from "../../middleware/validation.middleware.js";

const router = express.Router();

router.post("/login", loginValidation, validate, login);

export default router;
