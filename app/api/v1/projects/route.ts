import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ProjectService } from '@/features/projects/domain/service';
import { createProjectSchema } from '@/features/projects/config/project.schema';

const projectService = new ProjectService();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await projectService.getUserProjects(session.user.id);
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await projectService.createProject({
      ...validatedData,
      ownerId: session.user.id,
    });

    // Log activity
    await projectService.logActivity({
      projectId: project.id,
      userId: session.user.id,
      action: 'create',
      entityType: 'project',
      entityId: project.id,
      metadata: { name: project.name },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}