import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ProjectService } from '@/features/projects/domain/service';
import { updateDiagramSchema } from '@/features/projects/config/project.schema';

const projectService = new ProjectService();

export async function GET(
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

    const diagram = await projectService.getDiagram(params.id);
    if (!diagram) {
      return NextResponse.json({ error: 'Diagram not found' }, { status: 404 });
    }

    // Check if user has access to the project
    const hasAccess = await projectService.hasReadAccess(diagram.projectId, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: diagram });
  } catch (error) {
    console.error('Error fetching diagram:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagram' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const diagram = await projectService.getDiagram(params.id);
    if (!diagram) {
      return NextResponse.json({ error: 'Diagram not found' }, { status: 404 });
    }

    // Check if user has write access to the project
    const hasAccess = await projectService.hasWriteAccess(diagram.projectId, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateDiagramSchema.parse(body);

    const updatedDiagram = await projectService.updateDiagram(params.id, {
      ...validatedData,
      lastModifiedBy: session.user.id,
    });

    if (!updatedDiagram) {
      return NextResponse.json({ error: 'Failed to update diagram' }, { status: 500 });
    }

    // Log activity
    await projectService.logActivity({
      projectId: diagram.projectId,
      userId: session.user.id,
      action: 'update',
      entityType: 'diagram',
      entityId: params.id,
      metadata: validatedData,
    });

    return NextResponse.json({ data: updatedDiagram });
  } catch (error) {
    console.error('Error updating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to update diagram' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const diagram = await projectService.getDiagram(params.id);
    if (!diagram) {
      return NextResponse.json({ error: 'Diagram not found' }, { status: 404 });
    }

    // Check if user has write access to the project
    const hasAccess = await projectService.hasWriteAccess(diagram.projectId, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await projectService.deleteDiagram(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete diagram' }, { status: 500 });
    }

    // Log activity
    await projectService.logActivity({
      projectId: diagram.projectId,
      userId: session.user.id,
      action: 'delete',
      entityType: 'diagram',
      entityId: params.id,
      metadata: { name: diagram.name },
    });

    return NextResponse.json({ message: 'Diagram deleted successfully' });
  } catch (error) {
    console.error('Error deleting diagram:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagram' },
      { status: 500 }
    );
  }
}