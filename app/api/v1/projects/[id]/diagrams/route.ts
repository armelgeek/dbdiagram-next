import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ProjectService } from '@/features/projects/domain/service';
import { createDiagramSchema } from '@/features/projects/config/project.schema';

const projectService = new ProjectService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has write access to project
    const hasAccess = await projectService.hasWriteAccess(params.id, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createDiagramSchema.parse(body);

    const diagram = await projectService.createDiagram({
      ...validatedData,
      projectId: params.id,
      createdBy: session.user.id,
    });

    // Log activity
    await projectService.logActivity({
      projectId: params.id,
      userId: session.user.id,
      action: 'create',
      entityType: 'diagram',
      entityId: diagram.id,
      metadata: { name: diagram.name },
    });

    return NextResponse.json({ data: diagram }, { status: 201 });
  } catch (error) {
    console.error('Error creating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to create diagram' },
      { status: 500 }
    );
  }
}