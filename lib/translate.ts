/**
 * Traduce los campos de un proyecto llamando al API route del servidor.
 * Esto mantiene la API key segura en el servidor.
 */
export async function translateProjectFields(project: {
  title: string;
  description: string;
  content: string;
}): Promise<{
  title_en: string;
  description_en: string;
  content_en: string;
}> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        content: project.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Translation API error:', errorData);
      // Si falla la traducción, retornar el texto original
      return {
        title_en: project.title,
        description_en: project.description,
        content_en: project.content,
      };
    }

    const data = await response.json();
    return {
      title_en: data.title_en,
      description_en: data.description_en,
      content_en: data.content_en,
    };
  } catch (error) {
    console.error('Error calling translate API:', error);
    // Si hay error, retornar el texto original
    return {
      title_en: project.title,
      description_en: project.description,
      content_en: project.content,
    };
  }
}
