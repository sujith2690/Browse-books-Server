import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBconnection from './dataBase/db.js'
import authRoute from './router/authRoute.js'
import bookRoute from './router/bookRoute.js'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

DBconnection();

app.use('/auth',authRoute);
app.use('/book',bookRoute);





const PORT = process.env.PORT
app.listen(PORT,()=>{ console.log(`App is running on ${PORT}`)})