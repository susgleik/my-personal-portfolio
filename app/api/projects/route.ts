import { NextResponse } from 'next/server';
import { getPublishedProjects, getFeaturedProjects } from '@/lib/firestore';

// Revalidar cada hora (3600 segundos)
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let projects;
    if (featured === 'true') {
      projects = await getFeaturedProjects(limit);
    } else {
      projects = await getPublishedProjects(limit);
    }

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
