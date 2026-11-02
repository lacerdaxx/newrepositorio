// Gera versões otimizadas (AVIF/WebP em várias larguras) a partir de photos-src/.
// Uso: coloque as fotos em photos-src/ com os nomes de src/data/photos.ts
// (hero, byd, citroen, peugeot, ford, nissan) e rode: npm run photos
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'photos-src'
const OUT = 'public/photos'
const WIDTHS = [640, 1200, 1920, 2560]
await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
if (!files.length) console.log('Nenhuma foto em photos-src/.')

for (const file of files) {
  const name = path.parse(file).name.toLowerCase()
  const input = sharp(path.join(SRC, file)).rotate()
  for (const w of WIDTHS) {
    const resized = input.clone().resize({ width: w, withoutEnlargement: true })
    await resized.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${name}-${w}.webp`))
    await resized.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${name}-${w}.avif`))
  }
  console.log('ok', name)
}
