import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Global socket server instance
let io: SocketIOServer | null = null;

export async function GET() {
  return Response.json({ message: 'Socket.io endpoint ready' });
}

export async function POST() {
  return Response.json({ message: 'Socket.io endpoint ready' });
}

// Initialize Socket.io server
export function initializeSocket(server: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(server, {
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join project room
    socket.on('project:join', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
      
      // Broadcast user joined
      socket.to(`project:${projectId}`).emit('user:joined', {
        socketId: socket.id,
        projectId,
      });
    });

    // Leave project room
    socket.on('project:leave', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
      
      // Broadcast user left
      socket.to(`project:${projectId}`).emit('user:left', {
        socketId: socket.id,
        projectId,
      });
    });

    // Handle chat messages
    socket.on('chat:send', (data) => {
      const { projectId } = data;
      socket.to(`project:${projectId}`).emit('chat:message', data);
    });

    // Handle cursor movements
    socket.on('cursor:move', (data) => {
      const { projectId } = data;
      socket.to(`project:${projectId}`).emit('cursor:moved', {
        ...data,
        socketId: socket.id,
      });
    });

    // Handle diagram updates
    socket.on('diagram:update', (data) => {
      const { projectId } = data;
      socket.to(`project:${projectId}`).emit('diagram:updated', data);
    });

    // Handle activity logs
    socket.on('activity:log', (data) => {
      const { projectId } = data;
      socket.to(`project:${projectId}`).emit('activity:new', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

export function getSocket() {
  return io;
}