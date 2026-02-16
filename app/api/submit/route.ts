import { NextRequest, NextResponse } from 'next/server';
import { saveQuizResult, QuizResult } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body: QuizResult = await request.json();
    
    // Validate required fields
    if (!body.sessionId || !body.typeCode || !body.answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Notion
    const result = await saveQuizResult(body);
    
    return NextResponse.json({ 
      success: true, 
      pageId: result.id 
    });
  } catch (error) {
    console.error('Error saving to Notion:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
