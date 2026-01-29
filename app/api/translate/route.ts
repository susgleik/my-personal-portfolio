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

async function translateText(
  text: string,
  targetLang: string = 'en',
  sourceLang: string = 'es'
): Promise<string> {
  if (!text || text.trim() === '') {
    return text;
  }

  const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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

export async function POST(request: NextRequest) {
  try {
    // Verificar que la API key esté configurada
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

    // Traducir todos los campos en paralelo
    const [title_en, description_en, content_en] = await Promise.all([
      translateText(title),
      translateText(description),
      translateText(content),
    ]);

    return NextResponse.json({
      title_en,
      description_en,
      content_en,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
