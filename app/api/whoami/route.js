import { NextResponse } from 'next/server';

export async function GET(request) {
  // 헤더에서 IP 추출 (프록시 환경 고려)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
  
  return NextResponse.json({ ip });
}