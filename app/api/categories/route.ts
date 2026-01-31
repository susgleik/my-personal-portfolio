import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/firestore';

// Revalidar cada 6 horas (las categorías cambian poco)
export const revalidate = 21600;

export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
