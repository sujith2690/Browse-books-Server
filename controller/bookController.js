import bookModel from "../model/bookModel.js";
import userModel from "../model/userModel.js";
import cloudinary from '../utils/cloudinary.js'


export const addNewBook = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, category, description, author, price, imageUrl } = req.body;
        const userDetails = await userModel.findById(userId)
        const result = await cloudinary.uploader.upload(imageUrl, {
            upload_preset: 'BrowsBooks',
            folder: 'BrowsBooks',
        });
        const newBook = await bookModel.create({
            userId,
            title,
            category,
            description,
            author,
            price,
            imageUrl: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        const savedBook = await newBook.save();

        // Send a notification to all users
        const allUsers = await userModel.find({});
        const notificationContent = `${userDetails.name} added a new book: ${title}`;
        for (const user of allUsers) {
            if (user._id.toString() !== userId) {
                user.Notifications.push({
                    content: notificationContent,
                    userId: userId,
                    bookId:savedBook._id,
                    date: new Date(),
                });
                await user.save();
            }
        }
        return res.status(200).json({ message: 'New Book Added', savedBook, success: true });
    } catch (error) {
        console.error('Error adding a new book:', error);
        return res.status(400).json({ message: 'Error book not registered', success: false });
    }
};
export const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id
        const bookDetails = await bookModel.findById(bookId)
        if (!bookDetails) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const data = {
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            author: req.body.author,
            price: req.body.price,
        }
        if (req.body.imageUrl.public_id !== '') {
            data.imageUrl = req.body.imageUrl
        } else {
            const newImgId = req.body.imageUrl
            const existImageId = bookDetails.imageUrl.public_id
            if (existImageId) {
                await cloudinary.uploader.destroy(existImageId)
            }
            const newImage = await cloudinary.uploader.upload(newImgId, {
                upload_preset: 'BrowsBooks',
                folder: 'BrowsBooks',
                width: 1000,
                crop: 'scale'
            })
            data.imageUrl = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        }
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, data, { new: true });
        res.status(200).json({ message: 'Book Updated', success: true, updatedBook })
    } catch (error) {
        console.error('Error adding a new book:', error);
        return res.status(400).json({ message: "error book not registered", success: false });
    }
};

export const featuredBooks = async (req, res) => {
    try {
        const books = await bookModel.find();
        return res.status(200).json({ books });
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const bookCategories = async (req, res) => {
    try {
        const books = await bookModel.find();
        const categories = Array.from(new Set(books.map(book => book.category)));
        res.status(200).json({ categories });
    } catch (error) {
        console.log(error, 'error on categories');
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const bookSearch = async (req, res) => {
    try {
        const query = req.query.query;
        const regex = new RegExp(query, "i");
        let filter = {
            $or: [
                { title: { $regex: regex } },
                { author: { $regex: regex } },
            ],
        };
        let findBook = await bookModel.find(filter);
        res.status(200).json(findBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const getBookDetails = async (req, res) => {
    try {
        const bookId = req.params.id
        const bookDetails = await bookModel.findById(bookId)
        res.status(200).json(bookDetails)
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: error.message });
    }
}
export const getUserBooks = async (req, res) => {
    try {
        const userId = req.userId
        const userBooks = await bookModel.find({ userId: userId }).sort({ createdAt: -1 })
        res.status(200).json(userBooks)
        if (!userBooks) {
            res.status(200).json({ message: 'No Books Found' })
        }
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: error.message });
    }
}
export const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const bookDetails = await bookModel.findById(bookId);
        const existImageId = bookDetails.imageUrl.public_id
        const result = await cloudinary.uploader.destroy(existImageId)
        if (!bookDetails) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const deletedBook = await bookModel.findByIdAndDelete(bookId)
        res.status(200).json({ message: 'Book Deleted' });
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
};

export const likeBook = async (req, res) => {
    try {
        const userId = req.userId;
        const bookId = req.params.id;
        const [userDetails, bookDetails] = await Promise.all([
            userModel.findById(userId),
            bookModel.findById(bookId)
        ]);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!bookDetails) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const bookIndex = userDetails.favoriteBooks.indexOf(bookId);
        if (bookIndex !== -1) {
            userDetails.favoriteBooks.splice(bookIndex, 1);
            await userDetails.save();
            return res.status(200).json({ message: 'Book UnLiked', bookDetails });
        } else {
            userDetails.favoriteBooks.push(bookId);
            await userDetails.save();
            res.status(200).json({ message: 'Book Liked', bookDetails });
        }
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
};

export const myFavoriteBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const userDetails = await userModel.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ message: "User Not Found" })
        }
        const favoriteBooks = userDetails.favoriteBooks;
        res.status(200).json({ favoriteBooks });
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
}

export const allNotification = async (req, res) => {
    try {
        const userId = req.userId
        const userDetails = await userModel.findById(userId)
        const notifications = userDetails.Notifications
        res.status(200).json({ notifications })
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
}

export const clearNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const userDetails = await userModel.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        userDetails.Notifications = [];
        await userDetails.save();
        res.status(200).json({ message: 'Notifications cleared successfully' });
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
};




