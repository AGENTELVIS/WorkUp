import express from "express";
import { Signin } from "../controller/User.controller.js";
import { Register } from "../controller/User.controller.js";
const router = express.Router()

router.post("/signin", Signin);
router.post("/register", Register);

export default router;