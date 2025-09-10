import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { projectMembers, projects } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export type SocketUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type ProjectRoom = {
  projectId: string;
  users: Map<string, SocketUser>;
  cursors: Map<string, { line: number; column: number; diagramId: string }>;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: ServerIO;

// Store active project rooms
const projectRooms = new Map<string, ProjectRoom>();

export const getIO = () => {
  return io;
};

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const session = await auth.api.getSession({
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!session?.user) {
          return next(new Error('Authentication error'));
        }

        socket.data.user = session.user;
        next();
      } catch {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      const user = socket.data.user as SocketUser;
      console.log(`User ${user.name} connected`);

      // Join project room
      socket.on('project:join', async (projectId: string) => {
        try {
          // Verify user has access to project
          const membership = await db
            .select()
            .from(projectMembers)
            .where(
              and(
                eq(projectMembers.projectId, projectId),
                eq(projectMembers.userId, user.id)
              )
            )
            .limit(1);

          if (!membership.length) {
            // Check if user is project owner
            const project = await db
              .select()
              .from(projects)
              .where(eq(projects.id, projectId))
              .limit(1);

            if (!project.length || project[0].ownerId !== user.id) {
              socket.emit('error', { message: 'Access denied to project' });
              return;
            }
          }

          // Join Socket.io room
          socket.join(projectId);

          // Add user to project room tracking
          if (!projectRooms.has(projectId)) {
            projectRooms.set(projectId, {
              projectId,
              users: new Map(),
              cursors: new Map(),
            });
          }

          const room = projectRooms.get(projectId)!;
          room.users.set(socket.id, user);

          // Notify other users in the room
          socket.to(projectId).emit('user:joined', {
            user,
            socketId: socket.id,
            activeUsers: Array.from(room.users.values()),
          });

          // Send current active users to the joining user
          socket.emit('project:joined', {
            projectId,
            activeUsers: Array.from(room.users.values()),
          });

          console.log(`User ${user.name} joined project ${projectId}`);
        } catch (error) {
          console.error('Error joining project:', error);
          socket.emit('error', { message: 'Failed to join project' });
        }
      });

      // Leave project room
      socket.on('project:leave', (projectId: string) => {
        socket.leave(projectId);
        
        const room = projectRooms.get(projectId);
        if (room) {
          room.users.delete(socket.id);
          room.cursors.delete(socket.id);
          
          socket.to(projectId).emit('user:left', {
            user,
            socketId: socket.id,
            activeUsers: Array.from(room.users.values()),
          });

          // Clean up empty rooms
          if (room.users.size === 0) {
            projectRooms.delete(projectId);
          }
        }

        console.log(`User ${user.name} left project ${projectId}`);
      });

      // Real-time diagram editing
      socket.on('diagram:update', (data: {
        diagramId: string;
        projectId: string;
        content: string;
        cursor?: { line: number; column: number };
      }) => {
        const room = projectRooms.get(data.projectId);
        if (room && data.cursor) {
          room.cursors.set(socket.id, {
            ...data.cursor,
            diagramId: data.diagramId,
          });
        }

        socket.to(data.projectId).emit('diagram:updated', {
          ...data,
          userId: user.id,
          userName: user.name,
          timestamp: new Date().toISOString(),
        });
      });

      // Cursor position updates
      socket.on('cursor:update', (data: {
        projectId: string;
        diagramId: string;
        line: number;
        column: number;
      }) => {
        const room = projectRooms.get(data.projectId);
        if (room) {
          room.cursors.set(socket.id, {
            line: data.line,
            column: data.column,
            diagramId: data.diagramId,
          });
        }

        socket.to(data.projectId).emit('cursor:updated', {
          userId: user.id,
          userName: user.name,
          socketId: socket.id,
          ...data,
        });
      });

      // Chat messages
      socket.on('chat:message', (data: {
        projectId: string;
        message: string;
        messageType?: string;
        mentions?: string[];
        replyTo?: string;
      }) => {
        const messageData = {
          id: crypto.randomUUID(),
          ...data,
          userId: user.id,
          userName: user.name,
          userImage: user.image,
          timestamp: new Date().toISOString(),
        };

        io.to(data.projectId).emit('chat:newMessage', messageData);
      });

      // Notes management
      socket.on('note:add', (data: {
        diagramId: string;
        projectId: string;
        content: string;
        position?: { x: number; y: number };
        targetElement?: string;
        color?: string;
      }) => {
        const noteData = {
          id: crypto.randomUUID(),
          ...data,
          createdBy: user.id,
          createdByName: user.name,
          timestamp: new Date().toISOString(),
        };

        io.to(data.projectId).emit('note:added', noteData);
      });

      socket.on('note:update', (data: {
        noteId: string;
        projectId: string;
        content: string;
        position?: { x: number; y: number };
        color?: string;
      }) => {
        io.to(data.projectId).emit('note:updated', {
          ...data,
          updatedBy: user.id,
          updatedByName: user.name,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on('note:delete', (data: {
        noteId: string;
        projectId: string;
      }) => {
        io.to(data.projectId).emit('note:deleted', {
          ...data,
          deletedBy: user.id,
          deletedByName: user.name,
          timestamp: new Date().toISOString(),
        });
      });

      // Project management events
      socket.on('project:update', (data: {
        projectId: string;
        name?: string;
        description?: string;
        settings?: Record<string, unknown>;
      }) => {
        socket.to(data.projectId).emit('project:updated', {
          ...data,
          updatedBy: user.id,
          updatedByName: user.name,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on('diagram:create', (data: {
        projectId: string;
        name: string;
        description?: string;
      }) => {
        const diagramData = {
          id: crypto.randomUUID(),
          ...data,
          createdBy: user.id,
          createdByName: user.name,
          timestamp: new Date().toISOString(),
        };

        io.to(data.projectId).emit('diagram:created', diagramData);
      });

      socket.on('diagram:delete', (data: {
        diagramId: string;
        projectId: string;
      }) => {
        io.to(data.projectId).emit('diagram:deleted', {
          ...data,
          deletedBy: user.id,
          deletedByName: user.name,
          timestamp: new Date().toISOString(),
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${user.name} disconnected`);
        
        // Remove user from all project rooms
        for (const [projectId, room] of projectRooms.entries()) {
          if (room.users.has(socket.id)) {
            room.users.delete(socket.id);
            room.cursors.delete(socket.id);
            
            socket.to(projectId).emit('user:left', {
              user,
              socketId: socket.id,
              activeUsers: Array.from(room.users.values()),
            });

            // Clean up empty rooms
            if (room.users.size === 0) {
              projectRooms.delete(projectId);
            }
          }
        }
      });
    });

    res.socket.server.io = io;
  }

  return io;
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.io already running');
  } else {
    initSocket(res);
  }
  res.end();
}