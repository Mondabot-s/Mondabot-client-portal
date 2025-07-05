import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendResponse = await fetch('http://localhost:3001/health');
    const data = await backendResponse.json();
    
    return NextResponse.json({
      status: 'ok',
      frontend: 'connected',
      backend: backendResponse.ok ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Backend server unavailable',
        frontend: 'connected',
        backend: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 503 }
    );
  }
} 