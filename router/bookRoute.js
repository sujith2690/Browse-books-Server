import express from 'express'
import { addNewBook, bookCategories, bookSearch, deleteBook, featuredBooks, getBookDetails, getUserBooks, updateBook } from '../controller/bookController.js';
import authMiddleWare from '../middleWare/authMiddleware.js';


const bookRoute = express.Router()

bookRoute.post("/addBook",authMiddleWare,addNewBook)
bookRoute.post("/updateBook/:id",authMiddleWare,updateBook)
bookRoute.delete('/deleteBook/:id',authMiddleWare,deleteBook)
bookRoute.get("/myBook",authMiddleWare,getUserBooks)

bookRoute.get("/featured",featuredBooks)
bookRoute.get("/categories",bookCategories)

bookRoute.get("/search",bookSearch)
bookRoute.get("/:id",getBookDetails)




export default bookRoute;