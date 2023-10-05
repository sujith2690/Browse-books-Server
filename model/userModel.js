import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Notifications: [
        {
            content: {
                type: String,
                required: true,
            },
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
            },
            date: Date,
        },
    ],
    favoriteBooks: [{
        type: mongoose.Types.ObjectId,
        ref: "books",
        required: true
    }]
})

const userModel = mongoose.model('users', userSchema);
export default userModel