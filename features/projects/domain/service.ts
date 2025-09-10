import { db } from '@/drizzle/db';
import { 
  projects, 
  projectMembers, 
  projectInvites, 
  diagrams, 
  diagramVersions, 
  notes, 
  chatMessages, 
  activityLog, 
  users 
} from '@/drizzle/schema';
import { 
  Project, 
  ProjectMember, 
  ProjectInvite, 
  Diagram, 
  DiagramVersion, 
  Note, 
  ChatMessage, 
  ActivityLogEntry,
  ProjectWithDetails,
  ProjectRole 
} from '../config/project.types';
import { eq, and, desc, asc, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export class ProjectService {
  // Project CRUD operations
  async createProject(data: {
    name: string;
    description?: string;
    visibility?: 'private' | 'public' | 'team';
    ownerId: string;
  }): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        ...data,
        visibility: data.visibility || 'private',
        settings: {},
      })
      .returning();
    
    return project as Project;
  }

  async getProject(projectId: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    
    return project as Project || null;
  }

  async getProjectWithDetails(projectId: string, userId: string): Promise<ProjectWithDetails | null> {
    // Get project with owner info
    const projectResult = await db
      .select({
        project: projects,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!projectResult.length) return null;

    const { project, owner } = projectResult[0];

    // Get members
    const membersResult = await db
      .select({
        member: projectMembers,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(projectMembers)
      .leftJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.projectId, projectId));

    // Get diagrams
    const diagramsResult = await db
      .select({
        diagram: diagrams,
        createdByUser: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(diagrams)
      .leftJoin(users, eq(diagrams.createdBy, users.id))
      .where(eq(diagrams.projectId, projectId))
      .orderBy(asc(diagrams.createdAt));

    // Determine user role
    let userRole: ProjectRole | undefined;
    if (project.ownerId === userId) {
      userRole = 'owner';
    } else {
      const membership = membersResult.find(m => m.member.userId === userId);
      userRole = membership?.member.role as ProjectRole;
    }

    return {
      ...project,
      members: membersResult.map(m => ({ ...m.member, user: m.user })) as ProjectMember[],
      diagrams: diagramsResult.map(d => ({ ...d.diagram, createdByUser: d.createdByUser })) as Diagram[],
      owner: owner!,
      userRole,
    } as ProjectWithDetails;
  }

  async getUserProjects(userId: string): Promise<ProjectWithDetails[]> {
    // Get projects where user is owner or member
    const ownedProjects = await db
      .select({
        project: projects,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.ownerId, userId))
      .orderBy(desc(projects.updatedAt));

    const memberProjects = await db
      .select({
        project: projects,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        membership: projectMembers,
      })
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.id))
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projectMembers.userId, userId))
      .orderBy(desc(projects.updatedAt));

    // Combine and deduplicate
    const allProjects = [
      ...ownedProjects.map(p => ({ ...p.project, owner: p.owner!, userRole: 'owner' as ProjectRole })),
      ...memberProjects.map(p => ({ ...p.project, owner: p.owner!, userRole: p.membership.role as ProjectRole })),
    ];

    // Remove duplicates and add basic details
    const uniqueProjects = allProjects.reduce((acc, project) => {
      if (!acc.find(p => p.id === project.id)) {
        acc.push({
          ...project,
          members: [],
          diagrams: [],
        } as ProjectWithDetails);
      }
      return acc;
    }, [] as ProjectWithDetails[]);

    return uniqueProjects;
  }

  async updateProject(projectId: string, data: {
    name?: string;
    description?: string;
    visibility?: 'private' | 'public' | 'team';
    settings?: Record<string, any>;
  }): Promise<Project | null> {
    const [updated] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, projectId))
      .returning();
    
    return updated as Project || null;
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, projectId));
    
    return result.rowCount > 0;
  }

  // Member management
  async addMember(projectId: string, userId: string, role: ProjectRole, invitedBy: string): Promise<ProjectMember> {
    const [member] = await db
      .insert(projectMembers)
      .values({
        projectId,
        userId,
        role,
        invitedBy,
        joinedAt: new Date(),
      })
      .returning();
    
    return member as ProjectMember;
  }

  async removeMember(projectId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(projectMembers)
      .where(and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      ));
    
    return result.rowCount > 0;
  }

  async updateMemberRole(projectId: string, userId: string, role: ProjectRole): Promise<ProjectMember | null> {
    const [updated] = await db
      .update(projectMembers)
      .set({ role, updatedAt: new Date() })
      .where(and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      ))
      .returning();
    
    return updated as ProjectMember || null;
  }

  // Invite management
  async createInvite(data: {
    projectId: string;
    email: string;
    role: ProjectRole;
    invitedBy: string;
  }): Promise<ProjectInvite> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [invite] = await db
      .insert(projectInvites)
      .values({
        ...data,
        token,
        expiresAt,
      })
      .returning();
    
    return invite as ProjectInvite;
  }

  async getInvite(token: string): Promise<ProjectInvite | null> {
    const [invite] = await db
      .select()
      .from(projectInvites)
      .where(eq(projectInvites.token, token))
      .limit(1);
    
    return invite as ProjectInvite || null;
  }

  async acceptInvite(token: string): Promise<ProjectInvite | null> {
    const [accepted] = await db
      .update(projectInvites)
      .set({ acceptedAt: new Date() })
      .where(eq(projectInvites.token, token))
      .returning();
    
    return accepted as ProjectInvite || null;
  }

  // Diagram management
  async createDiagram(data: {
    projectId: string;
    name: string;
    description?: string;
    content?: string;
    syntax?: string;
    createdBy: string;
  }): Promise<Diagram> {
    const [diagram] = await db
      .insert(diagrams)
      .values({
        ...data,
        content: data.content || '',
        syntax: data.syntax || 'mermaid',
        settings: {},
        version: '1.0.0',
      })
      .returning();
    
    return diagram as Diagram;
  }

  async getDiagram(diagramId: string): Promise<Diagram | null> {
    const [diagram] = await db
      .select()
      .from(diagrams)
      .where(eq(diagrams.id, diagramId))
      .limit(1);
    
    return diagram as Diagram || null;
  }

  async updateDiagram(diagramId: string, data: {
    name?: string;
    description?: string;
    content?: string;
    syntax?: string;
    settings?: Record<string, any>;
    lastModifiedBy: string;
  }): Promise<Diagram | null> {
    const [updated] = await db
      .update(diagrams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(diagrams.id, diagramId))
      .returning();
    
    return updated as Diagram || null;
  }

  async deleteDiagram(diagramId: string): Promise<boolean> {
    const result = await db
      .delete(diagrams)
      .where(eq(diagrams.id, diagramId));
    
    return result.rowCount > 0;
  }

  // Notes management
  async createNote(data: {
    diagramId: string;
    content: string;
    position?: { x: number; y: number };
    targetElement?: string;
    color?: string;
    createdBy: string;
  }): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values({
        ...data,
        color: data.color || '#ffeb3b',
      })
      .returning();
    
    return note as Note;
  }

  async getDiagramNotes(diagramId: string): Promise<Note[]> {
    const notesResult = await db
      .select({
        note: notes,
        createdByUser: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(notes)
      .leftJoin(users, eq(notes.createdBy, users.id))
      .where(eq(notes.diagramId, diagramId))
      .orderBy(asc(notes.createdAt));

    return notesResult.map(n => ({ ...n.note, createdByUser: n.createdByUser })) as Note[];
  }

  async updateNote(noteId: string, data: {
    content?: string;
    position?: { x: number; y: number };
    color?: string;
  }): Promise<Note | null> {
    const [updated] = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning();
    
    return updated as Note || null;
  }

  async deleteNote(noteId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(eq(notes.id, noteId));
    
    return result.rowCount > 0;
  }

  // Chat management
  async createChatMessage(data: {
    projectId: string;
    userId: string;
    message: string;
    messageType?: string;
    mentions?: string[];
    replyTo?: string;
  }): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({
        ...data,
        messageType: data.messageType || 'text',
        mentions: data.mentions || [],
      })
      .returning();
    
    return message as ChatMessage;
  }

  async getProjectChatMessages(projectId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    const messagesResult = await db
      .select({
        message: chatMessages,
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
      .limit(limit)
      .offset(offset);

    return messagesResult.map(m => ({ ...m.message, user: m.user })) as ChatMessage[];
  }

  // Activity logging
  async logActivity(data: {
    projectId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, any>;
  }): Promise<ActivityLogEntry> {
    const [entry] = await db
      .insert(activityLog)
      .values({
        ...data,
        metadata: data.metadata || {},
      })
      .returning();
    
    return entry as ActivityLogEntry;
  }

  async getProjectActivity(projectId: string, limit = 20): Promise<ActivityLogEntry[]> {
    const activityResult = await db
      .select({
        activity: activityLog,
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
      .limit(limit);

    return activityResult.map(a => ({ ...a.activity, user: a.user })) as ActivityLogEntry[];
  }

  // Check permissions
  async checkUserPermission(projectId: string, userId: string): Promise<ProjectRole | null> {
    // Check if user is owner
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project?.ownerId === userId) {
      return 'owner';
    }

    // Check if user is member
    const [membership] = await db
      .select()
      .from(projectMembers)
      .where(and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      ))
      .limit(1);

    return membership?.role as ProjectRole || null;
  }

  async hasWriteAccess(projectId: string, userId: string): Promise<boolean> {
    const role = await this.checkUserPermission(projectId, userId);
    return role === 'owner' || role === 'editor';
  }

  async hasReadAccess(projectId: string, userId: string): Promise<boolean> {
    const role = await this.checkUserPermission(projectId, userId);
    return role !== null;
  }
}