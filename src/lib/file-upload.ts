import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { prisma } from './prisma'

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow only specific file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Tipo de arquivo não permitido'))
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter,
})

// Process uploaded image
export const processImage = async (filePath: string): Promise<string> => {
  const processedPath = filePath.replace(/\.[^/.]+$/, '-processed.jpg')
  
  await sharp(filePath)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(processedPath)
  
  // Remove original file
  fs.unlinkSync(filePath)
  
  return processedPath
}

// Save file metadata to database
export const saveFileMetadata = async (
  clientId: string,
  file: Express.Multer.File,
  processedPath?: string
) => {
  const finalPath = processedPath || file.path
  
  return await prisma.document.create({
    data: {
      clientId,
      filename: path.basename(finalPath),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: finalPath,
    }
  })
}

// Delete file and metadata
export const deleteFile = async (documentId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId }
  })
  
  if (document) {
    // Delete physical file
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path)
    }
    
    // Delete database record
    await prisma.document.delete({
      where: { id: documentId }
    })
  }
}

// Get file stream for serving
export const getFileStream = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found')
  }
  
  return fs.createReadStream(filePath)
}