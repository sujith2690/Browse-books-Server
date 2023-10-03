import express from 'express'
import { addManyBooks, addNewBook, bookCategories, bookSearch, featuredBooks, getBookDetails } from '../controller/bookController.js';


const bookRoute = express.Router()

bookRoute.post("/addBook",addNewBook)
bookRoute.get("/featured",featuredBooks)
bookRoute.post("/manyBook",addManyBooks)
bookRoute.get("/categories",bookCategories)

bookRoute.get("/search",bookSearch)
bookRoute.get("/:id",getBookDetails)




export default bookRoute;