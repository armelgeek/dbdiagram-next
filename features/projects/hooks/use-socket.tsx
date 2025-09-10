import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/shared/hooks/use-auth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinProject: () => {},
  leaveProject: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user) return;

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      path: '/api/socket',
      auth: {
        token: session.token,
      },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session]);

  const joinProject = (projectId: string) => {
    if (socket) {
      socket.emit('project:join', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket) {
      socket.emit('project:leave', projectId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinProject,
        leaveProject,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};