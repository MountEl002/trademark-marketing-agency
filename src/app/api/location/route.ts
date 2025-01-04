import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  
  // Get the real IP address, considering proxy headers
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip')

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    
    return NextResponse.json({
      country: data.country,
      city: data.city,
      ip: ip || 'unknown'
    })
  } catch (error) {
     console.error('Failed to fetch location:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({
      country: 'Unknown',
      ip: ip || 'unknown'
    }, { status: 500 })
  }
}