import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ProjectService } from '@/features/projects/domain/service';
import { updateProjectSchema } from '@/features/projects/config/project.schema';

const projectService = new ProjectService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // Await params and destructure id
    const { id } = await params;
    // Check if user has access to project
    const hasAccess = await projectService.hasReadAccess(id, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const project = await projectService.getProjectWithDetails(id, session.user.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // Await params and destructure id
    const { id } = await params;
    // Check if user has write access
    const hasAccess = await projectService.hasWriteAccess(id, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    const project = await projectService.updateProject(id, validatedData);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log activity
    await projectService.logActivity({
      projectId: id,
      userId: session.user.id,
      action: 'update',
      entityType: 'project',
      entityId: id,
      metadata: validatedData,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // Await params and destructure id
    const { id } = await params;
    // Check if user is owner
    const role = await projectService.checkUserPermission(id, session.user.id);
    if (role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await projectService.deleteProject(id);
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}