import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
const URL = process.env.MONGO_URL
const DBconnection = async () => {
    try {
        await mongoose.connect(URL, { useNewUrlParser: true })
        console.log('DB Connected')
    } catch (error) {
        console.log('DB Connection Failed', error)
    }
}
export default DBconnection