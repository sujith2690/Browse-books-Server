import express from 'express'
import { addNewBook, allNotification, bookCategories, bookSearch, categoryBooks, clearNotification, deleteBook, featuredBooks, getBookDetails, getUserBooks, likeBook, myFavoriteBooks, updateBook } from '../controller/bookController.js';
import authMiddleware from '../middleWare/authMiddleware.js';


const bookRoute = express.Router()

bookRoute.post("/addBook", authMiddleware, addNewBook)
bookRoute.post("/updateBook/:id",authMiddleware, updateBook)
bookRoute.delete('/deleteBook/:id',authMiddleware, deleteBook)

bookRoute.get("/myBook",authMiddleware, getUserBooks)
bookRoute.put("/likeBook/:id",authMiddleware, likeBook)
bookRoute.get("/myFavoriteBooks",authMiddleware, myFavoriteBooks)
bookRoute.get("/notion",authMiddleware, allNotification)
bookRoute.patch("/clearNotes",authMiddleware, clearNotification)

bookRoute.get("/featured", featuredBooks)
bookRoute.get("/categories", bookCategories)
bookRoute.get("/categoryBooks/:categoryName", categoryBooks)

bookRoute.get("/search", bookSearch)
bookRoute.get("/:id", getBookDetails)


export default bookRoute;