import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";


export const loginUser = async (req, res) => {
    console.log(req.body, '----login user Details')
}

export const signUpUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        } else {
            const pass = req.body.password
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(pass, salt);
            const saveUser = new userModel({ name, email, password: hashedPass, books: [] });
            await saveUser.save();
            const { password, createdAt, updatedAt, __v, ...others } = saveUser._doc
            // T O K E N
            const jwt = pkg
            const key = process.env.JWT_KEY
            const token = jwt.sign(
                {
                    email: saveUser.email,
                    id: saveUser._id,
                },
                key,
                { expiresIn: "24h" }
            );
            return res.status(200).json({ success: true, User: others, Token: token, message: 'SignUp Successful' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while SignUp' });
    }
}