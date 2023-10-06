import mongoose  from "mongoose";

const otpVerificationSchema = mongoose.Schema({
    email:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    },
    otp:{
        type:String
    }
},
{
    timestamps:true
});

var otpVerificationModel = mongoose.model("otpVerification",otpVerificationSchema)
export default otpVerificationModel