import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBconnection from './dataBase/db.js'
import authRoute from './router/authRoute.js'
import bookRoute from './router/bookRoute.js'
import uploadRoute from './router/uploadRoute.js'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ extended: true, limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

DBconnection();
app.use('/auth',authRoute);
app.use('/book',bookRoute);
app.use('/upload',uploadRoute)




const PORT = process.env.PORT
app.listen(PORT,()=>{ console.log(`App is running on ${PORT}`)})