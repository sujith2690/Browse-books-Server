import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body,'------body')
        const jwt = pkg;
        const User = await userModel.findOne({ email: email });
        if (User) {
            const validity = await bcrypt.compare(password, User.password);
            if (!validity) {
                console.log(req.body, 'Login failed')
                return res.status(200).json({ message: "Wrong Email or Password", success: false });
            } else {
                const Token = jwt.sign(
                    {
                        email: User.email,
                        id: User._id,
                    },
                    process.env.JWT_KEY,
                    { expiresIn: "24h" }
                );
                const { password, createdAt, updatedAt, __v, ...others } = User._doc
                console.log(req.body, 'Login Success')
                return res.status(200).json({ User: others, Token, success: true, message: "Login Success" });
            }
        } else {
            return res.status(400).json({ message: "User does not Exist", success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

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