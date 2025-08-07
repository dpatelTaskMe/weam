import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the base URL from environment variable or use Docker service name
    const baseUrl = process.env.NEXT_PUBLIC_COMMON_NODE_API_URL || 'http://nodejs:4050';
    const apiPrefix = process.env.NEXT_PUBLIC_NODE_API_PREFIX || '/v1';
    
    // In Docker environment, replace localhost with container name
    const dockerBaseUrl = baseUrl.replace('http://localhost:4050', 'http://nodejs:4050');
    
    const response = await fetch(`${dockerBaseUrl}${apiPrefix}/web/page/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authentication headers
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        // Forward other important headers
        ...(request.headers.get('x-csrf-token') && {
          'x-csrf-token': request.headers.get('x-csrf-token')!
        }),
        ...(request.headers.get('x-csrf-raw') && {
          'x-csrf-raw': request.headers.get('x-csrf-raw')!
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Failed to get pages',
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error getting pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

