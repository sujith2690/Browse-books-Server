import express from 'express'
import { addNewBook, allNotification, bookCategories, bookSearch, categoryBooks, clearNotification, deleteBook, featuredBooks, getBookDetails, getUserBooks, likeBook, myFavoriteBooks, updateBook } from '../controller/bookController.js';
import authMiddleWare from '../middleWare/authMiddleware.js';


const bookRoute = express.Router()

bookRoute.post("/addBook", authMiddleWare, addNewBook)
bookRoute.post("/updateBook/:id", authMiddleWare, updateBook)
bookRoute.delete('/deleteBook/:id', authMiddleWare, deleteBook)
bookRoute.get("/myBook", authMiddleWare, getUserBooks)
bookRoute.put("/likeBook/:id", authMiddleWare, likeBook)
bookRoute.get("/myFavoriteBooks", authMiddleWare, myFavoriteBooks)
bookRoute.get("/notion", authMiddleWare, allNotification)
bookRoute.patch("/clearNotes", authMiddleWare, clearNotification)

bookRoute.get("/featured", featuredBooks)
bookRoute.get("/categories", bookCategories)
bookRoute.get("/categoryBooks/:categoryName", categoryBooks)

bookRoute.get("/search", bookSearch)
bookRoute.get("/:id", getBookDetails)




export default bookRoute;