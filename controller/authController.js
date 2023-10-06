import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import nodemailer from 'nodemailer'
import otpVerificationModel from "../model/OtpVerifyModal.js";



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body, '------body')
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
            const otpSend = await sendOtpVerificationEmail(saveUser);
            return res.status(200).json({ success: true, message: 'Otp Send Check your email' });
            // await saveUser.save();
            // const { password, createdAt, updatedAt, __v, ...others } = saveUser._doc
            // // T O K E N
            // const jwt = pkg
            // const key = process.env.JWT_KEY
            // const token = jwt.sign(
            //     {
            //         email: saveUser.email,
            //         id: saveUser._id,
            //     },
            //     key,
            //     { expiresIn: "24h" }
            // );
            // return res.status(200).json({ success: true, User: others, Token: token, message: 'SignUp Successful' });
        }

    } catch (error) {
        console.log(error, 'signup error');
        return res.status(500).json({ message: 'Error while SignUp' });
    }
}

const sendOtpVerificationEmail = async (user) => {
    try {
        const userEmail = user.email;
        const userId = user._id.toString();
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.NDMILR_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "Subject",
            text: "Email content",
            html: `<p>Email verification Code is <b>${otp}</b> from BrowsBooks. Ignore this mail if this is not done by you. </p>`,
        };
        console.log(otp, '---***---sent OTP')
        const info = await transporter.sendMail(mailOptions);

        // Log email response
        console.log("Email sent: " + info.response);

        // Hash the OTP before saving (if needed)
        const saltRound = 10;
        const hashedOtp = bcrypt.hashSync(otp, saltRound);

        const newOtpVerification = new otpVerificationModel({
            email: userEmail,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        await newOtpVerification.save();
        console.log(newOtpVerification, "---------OTP send success------");
        return {
            status: "pending",
            message: "Verification OTP email sent",
            data: {
                userId: userId,
                email: userEmail,
            },
        };
    } catch (error) {
        console.log(error, '--------email error');
        throw {
            status: "otp send failed",
            message: error.message,
        };
    }
};
export const otpVerify = async (req, res) => {
    console.log(req.body, '----body-----------')
    // const userEmail = req.body.email;
    // console.log(userEmail, "----------BODY---id");

    try {
        const userEmail = req.body.email
        const otp = req.body.otp
        console.log(userEmail, '---email---------', otp)
        if (!userEmail || !otp) {
            throw new Error("Empty OTP details are not allowed");
        }

        const otpVerificationData = await otpVerificationModel.findOne({ email: userEmail }).sort({ createdAt: -1 })
        console.log(otpVerificationData, "----otpVerificationData");

        if (!otpVerificationData) {
            return res.status(200).json({ message: "OTP verification data not found Pls Submit again", success: false });
        }
        const { expiresAt } = otpVerificationData;
        const hashedOtp = otpVerificationData.otp;
        if (expiresAt < Date.now()) {
            await otpVerificationModel.deleteMany({ userEmail });
            return res.status(200).json({ message: "OTP has expired", success: false });
        } else {
            console.log(otp, "---------otp", hashedOtp, "---55---hashedotp");
            const isValidOtp = bcrypt.compareSync(otp, hashedOtp);
            console.log(isValidOtp)
            if (!isValidOtp) {
                return res.status(200).json({ message: "Invalid OTP", success: false });
            } else {

                // OTP is valid, delete OTP verification data
                await otpVerificationModel.deleteMany({ email: userEmail });
                // Create a new user
                const { name, email, password } = req.body;
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password, salt);

                const existingUser = await userModel.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already registered", success: false });
                }
                const newUser = new userModel({ name, email, password: hashedPass, books: [] });
                await newUser.save();

                // Generate a JWT token for the newly registered user
                const jwt = pkg;
                const key = process.env.JWT_KEY;
                const token = jwt.sign(
                    {
                        email: newUser.email,
                        id: newUser._id,
                    },
                    key,
                    { expiresIn: "24h" }
                );

                const { password: _, createdAt, updatedAt, __v, ...user } = newUser._doc;
                return res.status(200).json({ success: true, User: user, Token: token, message: 'Sign-Up Successful', success: true });
            }
        }
    } catch (error) {
        console.error(error, '--------email error');
        res.status(500).json({ message: "Unmatched OTP", success: false });
    }
};
