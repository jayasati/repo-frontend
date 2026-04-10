import pako from 'pako'

/**
 * Encodes PlantUML source text into the format expected by the
 * PlantUML public server (https://www.plantuml.com/plantuml/).
 *
 * Algorithm: UTF-8 → raw deflate → PlantUML custom base64.
 */

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b)       // 0-9
  b -= 10
  if (b < 26) return String.fromCharCode(65 + b)       // A-Z
  b -= 26
  if (b < 26) return String.fromCharCode(97 + b)       // a-z
  b -= 26
  if (b === 0) return '-'
  if (b === 1) return '_'
  return '?'
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
  const c3 = ((b2 & 0xF) << 2) | (b3 >> 6)
  const c4 = b3 & 0x3F
  return (
    encode6bit(c1 & 0x3F) +
    encode6bit(c2 & 0x3F) +
    encode6bit(c3 & 0x3F) +
    encode6bit(c4 & 0x3F)
  )
}

export function encodePlantUml(text: string): string {
  const data = pako.deflateRaw(new TextEncoder().encode(text))
  let result = ''
  for (let i = 0; i < data.length; i += 3) {
    const b1 = data[i]
    const b2 = i + 1 < data.length ? data[i + 1] : 0
    const b3 = i + 2 < data.length ? data[i + 2] : 0
    result += append3bytes(b1, b2, b3)
  }
  return result
}

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml'

export function plantUmlSvgUrl(source: string): string {
  return `${PLANTUML_SERVER}/svg/${encodePlantUml(source)}`
}

export function plantUmlPngUrl(source: string): string {
  return `${PLANTUML_SERVER}/png/${encodePlantUml(source)}`
}
