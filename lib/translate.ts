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

export async function translateText(
  text: string,
  targetLang: string = 'en',
  sourceLang: string = 'es'
): Promise<string> {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('Google Translate API key not configured. Returning original text.');
    return text;
  }

  if (!text || text.trim() === '') {
    return text;
  }

  try {
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
  } catch (error) {
    console.error('Error translating text:', error);
    // Return original text if translation fails
    return text;
  }
}

export async function translateProjectFields(project: {
  title: string;
  description: string;
  content: string;
}): Promise<{
  title_en: string;
  description_en: string;
  content_en: string;
}> {
  const [title_en, description_en, content_en] = await Promise.all([
    translateText(project.title),
    translateText(project.description),
    translateText(project.content),
  ]);

  return {
    title_en,
    description_en,
    content_en,
  };
}
