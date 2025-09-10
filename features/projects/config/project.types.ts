export type ProjectRole = 'owner' | 'editor' | 'viewer';
export type ProjectVisibility = 'private' | 'public' | 'team';

export interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: ProjectVisibility;
  ownerId: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface ProjectInvite {
  id: string;
  projectId: string;
  email: string;
  role: ProjectRole;
  token: string;
  invitedBy: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface Diagram {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  content: string;
  syntax: string;
  settings: Record<string, any>;
  createdBy: string;
  lastModifiedBy?: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface DiagramVersion {
  id: string;
  diagramId: string;
  version: string;
  content: string;
  message?: string;
  createdBy: string;
  createdAt: Date;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Note {
  id: string;
  diagramId: string;
  content: string;
  position?: { x: number; y: number };
  targetElement?: string;
  color: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  message: string;
  messageType: string;
  mentions: string[];
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  replyToMessage?: ChatMessage;
}

export interface ActivityLogEntry {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface ProjectWithDetails extends Project {
  members: ProjectMember[];
  diagrams: Diagram[];
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  userRole?: ProjectRole;
}