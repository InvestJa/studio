import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRateLimiter } from '@/lib/rate-limiter'
import { upload, processImage, saveFileMetadata } from '@/lib/file-upload'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Rate limiting
    const limiter = getRateLimiter('upload')
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    try {
      await limiter.consume(ip)
    } catch {
      return NextResponse.json(
        { error: 'Muitos uploads. Tente novamente em 1 hora.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string

    if (!file || !clientId) {
      return NextResponse.json(
        { error: 'Arquivo e ID do cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Convert File to Express.Multer.File format
    const buffer = Buffer.from(await file.arrayBuffer())
    const multerFile = {
      fieldname: 'file',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      size: file.size,
      buffer,
      path: '', // Will be set by multer
    } as Express.Multer.File

    // Process the file (this would normally be handled by multer middleware)
    // For now, we'll save it manually
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.name}`
    const filePath = `${uploadDir}/${filename}`
    
    // Save file
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    fs.writeFileSync(filePath, buffer)

    // Process image if it's an image
    let finalPath = filePath
    if (file.type.startsWith('image/')) {
      try {
        finalPath = await processImage(filePath)
      } catch (error) {
        logger.warn('Image processing failed, using original:', error)
      }
    }

    // Save metadata to database
    const document = await saveFileMetadata(clientId, {
      ...multerFile,
      path: finalPath,
    }, finalPath !== filePath ? finalPath : undefined)

    logger.info(`File uploaded: ${document.id} by user: ${session.user.id}`)

    return NextResponse.json({
      id: document.id,
      filename: document.filename,
      originalName: document.originalName,
      size: document.size,
      mimeType: document.mimeType,
    })

  } catch (error) {
    logger.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}