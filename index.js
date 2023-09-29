import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBconnection from './dataBase/db.js'
import authRoute from './router/authRoute.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth',authRoute);




const PORT = process.env.PORT
app.listen(PORT,()=>{ console.log(`App is running on ${PORT}`)})
DBconnection()