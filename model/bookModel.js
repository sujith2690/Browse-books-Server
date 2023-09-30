import mongoose from "mongoose";
import moment from 'moment';

const bookSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: moment().format('DD MMMM YYYY'),
    },
},
    { timestamps: true }
);
var bookModel = mongoose.model("books", bookSchema)
export default bookModel;