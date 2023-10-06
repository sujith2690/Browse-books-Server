import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token Unauthorized' });
        }
        const decoded = jwt.verify(token, secret);
        req.userId = decoded?.id;
        next();
    } catch (error) {
        console.error(error, '-----------middleware');
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


export default authMiddleware;
