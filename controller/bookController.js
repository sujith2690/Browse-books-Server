import bookModel from "../model/bookModel.js";


export const addNewBook = async (req, res) => {
    try {
        console.log(req.body,'-------body')
        const newBook = new bookModel(req.body)
        const savedBook = await newBook.save();
        return res.status(200).json({ message: "Book Saved Success" });
    } catch (error) {
        return res.status(400).json({ message: "error book not registered", success: false });
        console.error('Error adding a new book:', error);
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


export const addManyBooks = async (req, res) => {
    try {
        // console.log(req.body, '-------incoming book details');
        const books = req.body;
        // if (!Array.isArray(books)) {
        //     return res.status(400).json({ message: "Invalid request format. Expected an array of books.", success: false });
        // }
        // const newBooks = [];
        // for (const book of books) {
        //     const { userId, category, title, author, description, image, price } = book;
        //     const newBook = new bookModel({
        //         userId,
        //         category,
        //         title,
        //         author,
        //         description,
        //         image,
        //         price
        //     });
        //     newBooks.push(newBook);
        // }

        // const savedBooks = await bookModel.insertMany(newBooks);

        // return res.status(200).json({ message: "Books Saved Successfully", success: true, savedBooks });
    } catch (error) {
        console.error('Error adding new books:', error);
        return res.status(500).json({ message: "An error occurred while saving books.", success: false });
    }
};
export const bookSearch = async (req, res) => {
    try {
        console.log(req.query.query, '...query');
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




