import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public', 'team']).default('private'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters').optional(),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public', 'team']).optional(),
  settings: z.record(z.any()).optional(),
});

export const inviteToProjectSchema = z.object({
  email: z.string().email('Valid email is required'),
  role: z.enum(['owner', 'editor', 'viewer']).default('viewer'),
});

export const createDiagramSchema = z.object({
  name: z.string().min(1, 'Diagram name is required').max(100, 'Diagram name must be less than 100 characters'),
  description: z.string().optional(),
  content: z.string().default(''),
  syntax: z.string().default('mermaid'),
});

export const updateDiagramSchema = z.object({
  name: z.string().min(1, 'Diagram name is required').max(100, 'Diagram name must be less than 100 characters').optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  syntax: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  targetElement: z.string().optional(),
  color: z.string().default('#ffeb3b'),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  color: z.string().optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  messageType: z.string().default('text'),
  mentions: z.array(z.string()).default([]),
  replyTo: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type InviteToProjectInput = z.infer<typeof inviteToProjectSchema>;
export type CreateDiagramInput = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramInput = z.infer<typeof updateDiagramSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;