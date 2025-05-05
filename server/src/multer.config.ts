import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

export const unlinkAsync = promisify(fs.unlink);
  
  // Configuration for multer
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define upload directory
        const uploadDir = path.join(__dirname, `../uploads/${req.body.destination}`);
        
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// File filter to only allow ICS files
export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Check file extension and mimetype
    const filetypes = /ics/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'text/calendar';
   
    if (!extname || !mimetype) {
        cb(new Error('Only ICS files are allowed'));
        return;
    }

    const uploadPath = req.body.destination || 'uploads';
    const filePath = path.join(uploadPath, file.originalname);
  
    // Check if file already exists
    if (fs.existsSync(filePath)) {
        // Reject the file
        cb(new Error('File already exists'));
        return;
    }

    // Accept the file
    return cb(null, true);
};


// Set up multer with our configuration
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});