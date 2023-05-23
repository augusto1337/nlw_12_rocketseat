import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const file = await request.file({
      limits: {
        fileSize: 5_242_880,
      },
    })

    if (!file) {
      return reply.code(400).send()
    }

    const mimetypeRegex = /^(video|image)\/*/
    const validateFileFormat = mimetypeRegex.test(file.mimetype)

    if (!validateFileFormat) {
      return reply.code(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(file.filename)

    const filename = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', filename),
    )

    await pump(file.file, writeStream)

    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/${filename}`, fullURL).toString()

    return { fileURL }
  })
}
