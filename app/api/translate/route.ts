import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

/**
 * Protege la sintaxis Markdown de la corrupción de Google Translate.
 *
 * Reglas por tipo de bloque:
 * - Code blocks CON idioma (```python): protegidos por completo, no se traducen
 * - Fence markers sin idioma (``` solo): solo el marcador protegido, el contenido SÍ se traduce (ASCII art)
 * - Filas separadoras de tabla (|---|---): protegidas por completo
 * - Filas de contenido de tabla: los | se reemplazan con [[P]], el texto de las celdas SÍ se traduce
 * - Marcador de blockquote (> ): reemplazado con [[BQ]], el contenido SÍ se traduce
 * - Inline code (`código`): protegido por completo
 */
function protectMarkdown(content: string): { text: string; blocks: string[] } {
  const blocks: string[] = [];
  const mkB = (i: number) => `[[BLOCK_${i}]]`;
  let text = content;

  // 1. Code blocks CON identificador de idioma: proteger por completo.
  //    El código real (Python, bash, TypeScript...) no debe traducirse.
  text = text.replace(/```[a-zA-Z]\w*\n[\s\S]*?```/g, (match) => {
    const i = blocks.length;
    blocks.push(match);
    return mkB(i);
  });

  // 2. Fence markers de code blocks SIN idioma (``` solo en su línea).
  //    Se protege SOLO el marcador ```, el contenido intermedio (ASCII art, diagramas)
  //    queda expuesto para que Google Translate traduzca el texto en español.
  text = text.replace(/^```$/gm, () => {
    const i = blocks.length;
    blocks.push('```');
    return mkB(i);
  });

  // 3. Bloques de tabla: grupos de líneas consecutivas que contienen |
  text = text.replace(/((?:^[^\n]*\|[^\n]*(?:\n|$))+)/gm, (tableMatch) => {
    const lines = tableMatch.trimEnd().split('\n');
    const processed = lines.map(line => {
      if (!line.trim()) return line;

      // Fila separadora: |---|---| o |:--|--:|
      // Estas filas definen el alineamiento y no deben modificarse.
      if (/^\s*\|(\s*:?-+:?\s*\|)+\s*$/.test(line)) {
        const i = blocks.length;
        blocks.push(line);
        return mkB(i);
      }

      // Fila de contenido: reemplazar | con [[P]] para preservar posiciones.
      // El texto de las celdas SÍ se traduce.
      return line.replace(/\|/g, '[[P]]');
    });
    return processed.join('\n') + '\n';
  });

  // 4. Marcador de blockquote: proteger el >, traducir el contenido.
  //    Sin esto Google Translate elimina el > y el bloque pierde su formato.
  text = text.replace(/^(>\s*)/gm, '[[BQ]]');

  // 5. Inline code: proteger por completo.
  text = text.replace(/`[^`\n]+`/g, (match) => {
    const i = blocks.length;
    blocks.push(match);
    return mkB(i);
  });

  return { text, blocks };
}

/**
 * Restaura todos los bloques protegidos después de la traducción.
 * Los patrones son flexibles para manejar espacios que Google Translate pueda agregar.
 */
function restoreMarkdown(translatedText: string, blocks: string[]): string {
  let result = translatedText;
  // Restaurar [[BLOCK_N]]
  result = result.replace(/\[\[\s*BLOCK_\s*(\d+)\s*\]\]/g, (_, n) => blocks[parseInt(n, 10)] ?? '');
  // Restaurar pipes de tabla
  result = result.replace(/\[\[\s*P\s*\]\]/g, '|');
  // Restaurar marcador de blockquote
  result = result.replace(/\[\[\s*BQ\s*\]\]/g, '> ');
  return result;
}

async function translateText(
  text: string,
  targetLang: string = 'en',
  sourceLang: string = 'es'
): Promise<string> {
  if (!text || text.trim() === '') return text;

  const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Google Translate API error:', errorData);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data: TranslateResponse = await response.json();
  return data.data.translations[0].translatedText;
}

async function translateMarkdownContent(content: string): Promise<string> {
  const { text, blocks } = protectMarkdown(content);
  const translatedText = await translateText(text);
  return restoreMarkdown(translatedText, blocks);
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_TRANSLATE_API_KEY) {
      return NextResponse.json(
        { error: 'Google Translate API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, description, content } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, content' },
        { status: 400 }
      );
    }

    // title y description son texto plano — traducción directa.
    // content es Markdown — usa el flujo protect → translate → restore.
    const [title_en, description_en, content_en] = await Promise.all([
      translateText(title),
      translateText(description),
      translateMarkdownContent(content),
    ]);

    return NextResponse.json({ title_en, description_en, content_en });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
