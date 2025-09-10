import { NextRequest } from 'next/server';
import { db } from '@/drizzle/db';
import { activityLog, users } from '@/drizzle/schema';
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

    // Get activities with user information
    const activities = await db
      .select({
        id: activityLog.id,
        userId: activityLog.userId,
        action: activityLog.action,
        entityType: activityLog.entityType,
        entityId: activityLog.entityId,
        metadata: activityLog.metadata,
        createdAt: activityLog.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(activityLog)
      .leftJoin(users, eq(activityLog.userId, users.id))
      .where(eq(activityLog.projectId, projectId))
      .orderBy(desc(activityLog.createdAt))
      .limit(50);

    return Response.json({ activities });
  } catch (error) {
    console.error('Error fetching activity log:', error);
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
    const { action, entityType, entityId, metadata = {} } = body;

    if (!action || !entityType) {
      return Response.json({ 
        error: 'Action and entity type are required' 
      }, { status: 400 });
    }

    // Insert the activity
    const [newActivity] = await db
      .insert(activityLog)
      .values({
        projectId,
        userId: session.user.id,
        action,
        entityType,
        entityId,
        metadata,
      })
      .returning();

    // Get the activity with user information
    const activityWithUser = await db
      .select({
        id: activityLog.id,
        userId: activityLog.userId,
        action: activityLog.action,
        entityType: activityLog.entityType,
        entityId: activityLog.entityId,
        metadata: activityLog.metadata,
        createdAt: activityLog.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(activityLog)
      .leftJoin(users, eq(activityLog.userId, users.id))
      .where(eq(activityLog.id, newActivity.id))
      .then(results => results[0]);

    return Response.json(activityWithUser);
  } catch (error) {
    console.error('Error creating activity log:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}