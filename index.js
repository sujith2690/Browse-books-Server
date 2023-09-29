import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBconnection from './dataBase/db.js'

dotenv.config()

const app = express()
app.use(cors())
const PORT = process.env.PORT
DBconnection()
app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`)
})