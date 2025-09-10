import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { ProjectWithDetails, Diagram } from '../config/project.types';
import { toast } from 'sonner';

export interface CollaborativeUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  socketId: string;
  cursor?: {
    line: number;
    column: number;
    diagramId: string;
  };
}

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected, joinProject, leaveProject } = useSocket();

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/projects/${projectId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProject(data.data);
      } else if (response.status === 404) {
        setError('Project not found');
      } else if (response.status === 403) {
        setError('Access denied');
      } else {
        setError('Failed to load project');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Join project room for real-time collaboration
  useEffect(() => {
    if (!isConnected || !socket) return;

    joinProject(projectId);

    // Listen for project events
    socket.on('project:joined', (data: { projectId: string; activeUsers: CollaborativeUser[] }) => {
      setActiveUsers(data.activeUsers);
    });

    socket.on('user:joined', (data: { user: any; socketId: string; activeUsers: CollaborativeUser[] }) => {
      setActiveUsers(data.activeUsers);
      toast.success(`${data.user.name} joined the project`);
    });

    socket.on('user:left', (data: { user: any; socketId: string; activeUsers: CollaborativeUser[] }) => {
      setActiveUsers(data.activeUsers);
      toast.info(`${data.user.name} left the project`);
    });

    socket.on('project:updated', (data: any) => {
      setProject(prev => prev ? { ...prev, ...data } : prev);
      toast.info(`Project updated by ${data.updatedByName}`);
    });

    socket.on('diagram:created', (data: any) => {
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          diagrams: [...prev.diagrams, data],
        };
      });
      toast.success(`New diagram "${data.name}" created by ${data.createdByName}`);
    });

    socket.on('diagram:deleted', (data: any) => {
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          diagrams: prev.diagrams.filter(d => d.id !== data.diagramId),
        };
      });
      toast.info(`Diagram deleted by ${data.deletedByName}`);
    });

    socket.on('cursor:updated', (data: any) => {
      setActiveUsers(prev => 
        prev.map(user => 
          user.socketId === data.socketId 
            ? { ...user, cursor: { line: data.line, column: data.column, diagramId: data.diagramId } }
            : user
        )
      );
    });

    return () => {
      socket.off('project:joined');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('project:updated');
      socket.off('diagram:created');
      socket.off('diagram:deleted');
      socket.off('cursor:updated');
      leaveProject(projectId);
    };
  }, [socket, isConnected, projectId, joinProject, leaveProject]);

  // Load project data
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Project actions
  const updateProject = async (data: {
    name?: string;
    description?: string;
    visibility?: 'private' | 'public' | 'team';
    settings?: Record<string, any>;
  }) => {
    try {
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setProject(prev => prev ? { ...prev, ...result.data } : null);
        
        // Broadcast to other users via socket
        if (socket) {
          socket.emit('project:update', {
            projectId,
            ...data,
          });
        }
        
        return result.data;
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const createDiagram = async (data: {
    name: string;
    description?: string;
    content?: string;
    syntax?: string;
  }) => {
    try {
      const response = await fetch(`/api/v1/projects/${projectId}/diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            diagrams: [...prev.diagrams, result.data],
          };
        });

        // Broadcast to other users via socket
        if (socket) {
          socket.emit('diagram:create', {
            projectId,
            ...data,
          });
        }

        return result.data;
      } else {
        throw new Error('Failed to create diagram');
      }
    } catch (error) {
      console.error('Error creating diagram:', error);
      throw error;
    }
  };

  const updateDiagram = async (diagramId: string, data: {
    name?: string;
    description?: string;
    content?: string;
    syntax?: string;
    settings?: Record<string, any>;
  }) => {
    try {
      const response = await fetch(`/api/v1/diagrams/${diagramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            diagrams: prev.diagrams.map(d => 
              d.id === diagramId ? { ...d, ...result.data } : d
            ),
          };
        });

        // Broadcast to other users via socket
        if (socket && data.content !== undefined) {
          socket.emit('diagram:update', {
            diagramId,
            projectId,
            content: data.content,
          });
        }

        return result.data;
      } else {
        throw new Error('Failed to update diagram');
      }
    } catch (error) {
      console.error('Error updating diagram:', error);
      throw error;
    }
  };

  const deleteDiagram = async (diagramId: string) => {
    try {
      const response = await fetch(`/api/v1/diagrams/${diagramId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            diagrams: prev.diagrams.filter(d => d.id !== diagramId),
          };
        });

        // Broadcast to other users via socket
        if (socket) {
          socket.emit('diagram:delete', {
            diagramId,
            projectId,
          });
        }

        return true;
      } else {
        throw new Error('Failed to delete diagram');
      }
    } catch (error) {
      console.error('Error deleting diagram:', error);
      throw error;
    }
  };

  const updateCursor = (diagramId: string, line: number, column: number) => {
    if (socket) {
      socket.emit('cursor:update', {
        projectId,
        diagramId,
        line,
        column,
      });
    }
  };

  return {
    project,
    activeUsers,
    isLoading,
    error,
    isConnected,
    actions: {
      updateProject,
      createDiagram,
      updateDiagram,
      deleteDiagram,
      updateCursor,
      refetch: fetchProject,
    },
  };
};