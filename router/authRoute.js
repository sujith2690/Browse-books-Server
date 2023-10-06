import express from 'express'
import { loginUser, otpVerify, signUpUser } from '../controller/authController.js';


const authRoute = express.Router()

authRoute.post("/login",loginUser)
authRoute.post('/signUp',signUpUser)
authRoute.post('/otpVerify',otpVerify)



export default authRoute;