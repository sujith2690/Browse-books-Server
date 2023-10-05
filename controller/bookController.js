import bookModel from "../model/bookModel.js";
import cloudinary from '../utils/cloudinary.js'


export const addNewBook = async (req, res) => {
    try {
        const userId = req.userId
        console.log(req.body, '-------next')
        const { title, category, description, author, price, imageUrl } = req.body

        const result = await cloudinary.uploader.upload(imageUrl, {
            upload_preset: 'BrowsBooks',
            folder: 'BrowsBooks',
        })
        console.log(result, '--------image upload=result')
        const newBook = await bookModel.create({
            userId, title, category, description, author, price,
            imageUrl: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })
        const savedBook = await newBook.save();
        console.log(savedBook, '------22---saved')
        return res.status(200).json({ message: "New Book Added", savedBook, success: true });
    } catch (error) {
        console.error('Error adding a new book:', error);
        return res.status(400).json({ message: "error book not registered", success: false });
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
        console.log(bookDetails, '----deleted book')
        const deletedBook = await bookModel.findByIdAndDelete(bookId)
        res.status(200).json({ message: 'Book Deleted' });
    } catch (error) {
        console.error(error, 'error');
        res.status(500).json({ message: error.message });
    }
};




