import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const pageId = params.id;
        
        const baseUrl = process.env.NEXT_PUBLIC_COMMON_NODE_API_URL || 'http://nodejs:4050';
        const apiPrefix = process.env.NEXT_PUBLIC_NODE_API_PREFIX || '/v1';
        const dockerBaseUrl = baseUrl.replace('http://localhost:4050', 'http://nodejs:4050');
        
        const response = await fetch(`${dockerBaseUrl}${apiPrefix}/web/page/${pageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': request.headers.get('x-csrf-token') || '',
                'x-csrf-raw': request.headers.get('x-csrf-raw') || '',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: 'Failed to update page', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const pageId = params.id;
        
        const baseUrl = process.env.NEXT_PUBLIC_COMMON_NODE_API_URL || 'http://nodejs:4050';
        const apiPrefix = process.env.NEXT_PUBLIC_NODE_API_PREFIX || '/v1';
        const dockerBaseUrl = baseUrl.replace('http://localhost:4050', 'http://nodejs:4050');
        
        const response = await fetch(`${dockerBaseUrl}${apiPrefix}/web/page/${pageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': request.headers.get('x-csrf-token') || '',
                'x-csrf-raw': request.headers.get('x-csrf-raw') || '',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: 'Failed to delete page', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
