// For now, just return a simple response since Socket.io setup is complex in App Router
export async function GET() {
  return Response.json({ message: 'Socket.io endpoint - use separate server setup' });
}

export async function POST() {
  return Response.json({ message: 'Socket.io endpoint - use separate server setup' });
}