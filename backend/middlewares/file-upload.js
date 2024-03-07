import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './assets/images');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, callback) => {
    const isValid = file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';
    callback(null, isValid);
};

const upload = multer({
    storage,
    limits: { fieldSize: 10485760 },
    fileFilter
});

export default upload;