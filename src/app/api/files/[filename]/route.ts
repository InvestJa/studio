import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFileStream } from '@/lib/file-upload'
import logger from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Find the document and verify user has access
    const document = await prisma.document.findFirst({
      where: {
        filename: params.filename,
        client: {
          userId: session.user.id
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    try {
      const fileStream = getFileStream(document.path)
      
      // Create a ReadableStream from the Node.js stream
      const readableStream = new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => {
            controller.enqueue(new Uint8Array(chunk))
          })
          
          fileStream.on('end', () => {
            controller.close()
          })
          
          fileStream.on('error', (error) => {
            controller.error(error)
          })
        }
      })

      return new NextResponse(readableStream, {
        headers: {
          'Content-Type': document.mimeType,
          'Content-Disposition': `inline; filename="${document.originalName}"`,
          'Content-Length': document.size.toString(),
        }
      })

    } catch (error) {
      logger.error('Error serving file:', error)
      return NextResponse.json({ error: 'Erro ao servir arquivo' }, { status: 500 })
    }

  } catch (error) {
    logger.error('Error in file route:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}