import { NextRequest } from 'next/server';
import { db } from '@/drizzle/db';
import { chatMessages, users } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;

    // Get messages with user information
    const messages = await db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        message: chatMessages.message,
        messageType: chatMessages.messageType,
        createdAt: chatMessages.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.projectId, projectId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(100);

    return Response.json({ 
      messages: messages.reverse() // Show oldest first
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const body = await request.json();
    const { message, messageType = 'text' } = body;

    if (!message?.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Insert the message
    const [newMessage] = await db
      .insert(chatMessages)
      .values({
        projectId,
        userId: session.user.id,
        message: message.trim(),
        messageType,
      })
      .returning();

    // Get the message with user information
    const messageWithUser = await db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        message: chatMessages.message,
        messageType: chatMessages.messageType,
        createdAt: chatMessages.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.id, newMessage.id))
      .then(results => results[0]);

    return Response.json(messageWithUser);
  } catch (error) {
    console.error('Error creating chat message:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}