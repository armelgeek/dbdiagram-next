import { sql } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const projectRoleEnum = pgEnum('project_role', ['owner', 'editor', 'viewer']);
export const projectVisibilityEnum = pgEnum('project_visibility', ['private', 'public', 'team']);

export const projects = pgTable('projects', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  visibility: projectVisibilityEnum('visibility').notNull().default('private'),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  settings: jsonb('settings').default({}), // Project-level settings like theme, layout preferences
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const projectMembers = pgTable('project_members', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: projectRoleEnum('role').notNull().default('viewer'),
  invitedBy: text('invited_by')
    .references(() => users.id),
  invitedAt: timestamp('invited_at'),
  joinedAt: timestamp('joined_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const projectInvites = pgTable('project_invites', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: projectRoleEnum('role').notNull().default('viewer'),
  token: text('token').notNull().unique(),
  invitedBy: text('invited_by')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const diagrams = pgTable('diagrams', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content').notNull().default(''), // Mermaid/custom DSL content
  syntax: text('syntax').notNull().default('mermaid'), // Type of syntax used
  settings: jsonb('settings').default({}), // Diagram-specific settings
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  lastModifiedBy: text('last_modified_by')
    .references(() => users.id),
  version: text('version').notNull().default('1.0.0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const diagramVersions = pgTable('diagram_versions', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  diagramId: text('diagram_id')
    .notNull()
    .references(() => diagrams.id, { onDelete: 'cascade' }),
  version: text('version').notNull(),
  content: text('content').notNull(),
  message: text('message'), // Commit-like message for the version
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const notes = pgTable('notes', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  diagramId: text('diagram_id')
    .notNull()
    .references(() => diagrams.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  position: jsonb('position'), // {x, y} coordinates for note positioning
  targetElement: text('target_element'), // ID of the diagram element the note is attached to
  color: text('color').default('#ffeb3b'), // Note color
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  message: text('message').notNull(),
  messageType: text('message_type').notNull().default('text'), // text, mention, system
  mentions: jsonb('mentions').default([]), // Array of mentioned user IDs
  replyTo: text('reply_to')
    .references(() => chatMessages.id), // For threaded conversations
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const activityLog = pgTable('activity_log', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(), // create, update, delete, join, leave, etc.
  entityType: text('entity_type').notNull(), // project, diagram, note, chat
  entityId: text('entity_id'), // ID of the affected entity
  metadata: jsonb('metadata').default({}), // Additional context about the action
  createdAt: timestamp('created_at').notNull().defaultNow(),
});